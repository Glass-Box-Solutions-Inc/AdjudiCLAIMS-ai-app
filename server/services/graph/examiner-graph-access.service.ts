/**
 * Examiner Graph Access Service — UPL-compliant graph query layer.
 *
 * Every graph query from a claims examiner passes through 5 filters:
 *   1. Document Access Level — remove nodes/edges sourced only from ATTORNEY_ONLY docs
 *   2. Content Flags — remove edges sourced only from flagged docs (legal analysis, work product, privileged)
 *   3. Node Type Restrictions — strip sensitive properties from LEGAL_ISSUE and SETTLEMENT nodes
 *   4. Edge Type Restrictions — strip reasoning from DECIDES edges
 *   5. UPL Zone Gate — RED blocks entirely, YELLOW adds disclaimer, GREEN passes through
 *
 * Claims examiners are NOT attorneys. They must never see legal analysis,
 * strategy, or work product. This is a hard legal requirement under
 * Cal. Bus. & Prof. Code section 6125.
 */

import type {
  GraphNodeType,
  GraphEdgeType,
  GraphNode,
  GraphEdge,
  Document,
} from '@prisma/client';
import { prisma } from '../../db.js';
import { confidenceLabel } from './confidence.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilteredNode {
  id: string;
  nodeType: GraphNodeType;
  canonicalName: string;
  properties: Record<string, unknown>;
  personRole?: string | null;
  orgType?: string | null;
  confidence: number;
  confidenceBadge: 'verified' | 'confident' | 'suggested' | 'ai_generated';
  sourceCount: number;
}

export interface FilteredEdge {
  id: string;
  edgeType: GraphEdgeType;
  sourceNodeId: string;
  targetNodeId: string;
  properties: Record<string, unknown>;
  confidence: number;
  weight: number;
  contradictionStatus: string;
}

export interface GraphQueryResult {
  nodes: FilteredNode[];
  edges: FilteredEdge[];
  disclaimer: string | null;
  wasFiltered: boolean;
  filterStats: {
    nodesRemoved: number;
    edgesRemoved: number;
    propertiesStripped: number;
  };
}

export type UplZone = 'GREEN' | 'YELLOW' | 'RED';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RED_DISCLAIMER =
  'This query requires legal analysis. Please consult defense counsel.';

const YELLOW_DISCLAIMER =
  'Statistical/comparative data — consult defense counsel for legal interpretation.';

/** Properties allowed on LEGAL_ISSUE nodes (everything else stripped). */
const LEGAL_ISSUE_ALLOWED_PROPS = new Set(['type', 'status']);

/** Properties allowed on SETTLEMENT nodes (everything else stripped). */
const SETTLEMENT_ALLOWED_PROPS = new Set(['type', 'amount', 'date']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a JSON-encoded string array safely. Returns empty array on failure.
 */
function parseDocIds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Build a lookup map of document ID -> Document (only fields we need).
 */
async function fetchDocumentMap(
  docIds: string[],
): Promise<Map<string, Pick<Document, 'id' | 'accessLevel' | 'containsLegalAnalysis' | 'containsWorkProduct' | 'containsPrivileged'>>> {
  if (docIds.length === 0) return new Map();

  const docs = await prisma.document.findMany({
    where: { id: { in: docIds } },
    select: {
      id: true,
      accessLevel: true,
      containsLegalAnalysis: true,
      containsWorkProduct: true,
      containsPrivileged: true,
    },
  });

  const map = new Map<string, typeof docs[number]>();
  for (const doc of docs) {
    map.set(doc.id, doc);
  }
  return map;
}

/**
 * Check whether ALL source documents for a given set of IDs are ATTORNEY_ONLY.
 * Returns true if the entity should be REMOVED (all sources are attorney-only).
 * If there are no source documents, the entity is retained (conservative).
 */
function allSourcesAttorneyOnly(
  docIds: string[],
  docMap: Map<string, { accessLevel: string }>,
): boolean {
  if (docIds.length === 0) return false;

  const resolved = docIds.filter((id) => docMap.has(id));
  if (resolved.length === 0) return false;

  return resolved.every((id) => docMap.get(id)!.accessLevel === 'ATTORNEY_ONLY');
}

/**
 * Check whether ALL source documents are flagged (legal analysis, work product, or privileged).
 * Returns true if the entity should be REMOVED.
 */
function allSourcesFlagged(
  docIds: string[],
  docMap: Map<string, { containsLegalAnalysis: boolean; containsWorkProduct: boolean; containsPrivileged: boolean }>,
): boolean {
  if (docIds.length === 0) return false;

  const resolved = docIds.filter((id) => docMap.has(id));
  if (resolved.length === 0) return false;

  return resolved.every((id) => {
    const doc = docMap.get(id)!;
    return doc.containsLegalAnalysis || doc.containsWorkProduct || doc.containsPrivileged;
  });
}

/**
 * Strip properties from a JSON object, keeping only allowed keys.
 * Returns the number of properties stripped.
 */
function stripProperties(
  props: Record<string, unknown>,
  allowedKeys: Set<string>,
): { cleaned: Record<string, unknown>; strippedCount: number } {
  const cleaned: Record<string, unknown> = {};
  let strippedCount = 0;

  for (const key of Object.keys(props)) {
    if (allowedKeys.has(key)) {
      cleaned[key] = props[key];
    } else {
      strippedCount++;
    }
  }

  return { cleaned, strippedCount };
}

// ---------------------------------------------------------------------------
// Main Function
// ---------------------------------------------------------------------------

/**
 * Query the knowledge graph for an examiner, applying all 5 UPL safety filters.
 *
 * @param claimId - The claim to query.
 * @param uplZone - The UPL zone classification for this query.
 * @param options - Optional filters and limits.
 * @returns Filtered graph data safe for examiner consumption.
 */
export async function queryGraphForExaminer(
  claimId: string,
  uplZone: UplZone,
  options?: {
    nodeTypes?: GraphNodeType[];
    maxNodes?: number;
    maxEdges?: number;
  },
): Promise<GraphQueryResult> {
  // -------------------------------------------------------------------------
  // Filter 5 (early exit): RED zone -> empty result with attorney referral
  // -------------------------------------------------------------------------
  if (uplZone === 'RED') {
    return {
      nodes: [],
      edges: [],
      disclaimer: RED_DISCLAIMER,
      wasFiltered: true,
      filterStats: { nodesRemoved: 0, edgesRemoved: 0, propertiesStripped: 0 },
    };
  }

  // -------------------------------------------------------------------------
  // Fetch raw graph data
  // -------------------------------------------------------------------------
  const nodeWhere: Record<string, unknown> = { claimId };
  if (options?.nodeTypes && options.nodeTypes.length > 0) {
    nodeWhere.nodeType = { in: options.nodeTypes };
  }

  const rawNodes: GraphNode[] = await prisma.graphNode.findMany({
    where: nodeWhere,
  });

  const nodeIds = new Set(rawNodes.map((n) => n.id));

  const rawEdges: GraphEdge[] = await prisma.graphEdge.findMany({
    where: {
      claimId,
      sourceNodeId: { in: [...nodeIds] },
      targetNodeId: { in: [...nodeIds] },
    },
  });

  // -------------------------------------------------------------------------
  // Collect all source document IDs for batch fetch
  // -------------------------------------------------------------------------
  const allDocIds = new Set<string>();
  for (const node of rawNodes) {
    for (const id of parseDocIds(node.sourceDocumentIds)) {
      allDocIds.add(id);
    }
  }
  for (const edge of rawEdges) {
    for (const id of parseDocIds(edge.sourceDocumentIds)) {
      allDocIds.add(id);
    }
  }

  const docMap = await fetchDocumentMap([...allDocIds]);

  // -------------------------------------------------------------------------
  // Filter 1: Document Access Level
  // -------------------------------------------------------------------------
  let nodesRemoved = 0;
  let edgesRemoved = 0;
  let propertiesStripped = 0;

  let filteredNodes = rawNodes.filter((node) => {
    const docIds = parseDocIds(node.sourceDocumentIds);
    if (allSourcesAttorneyOnly(docIds, docMap)) {
      nodesRemoved++;
      return false;
    }
    return true;
  });

  // Update surviving node IDs for edge filtering
  const survivingNodeIds = new Set(filteredNodes.map((n) => n.id));

  let filteredEdges = rawEdges.filter((edge) => {
    // Remove edges whose endpoints were removed
    if (!survivingNodeIds.has(edge.sourceNodeId) || !survivingNodeIds.has(edge.targetNodeId)) {
      edgesRemoved++;
      return false;
    }

    const docIds = parseDocIds(edge.sourceDocumentIds);
    if (allSourcesAttorneyOnly(docIds, docMap)) {
      edgesRemoved++;
      return false;
    }
    return true;
  });

  // -------------------------------------------------------------------------
  // Filter 2: Content Flags (edges only)
  // -------------------------------------------------------------------------
  filteredEdges = filteredEdges.filter((edge) => {
    const docIds = parseDocIds(edge.sourceDocumentIds);
    if (allSourcesFlagged(docIds, docMap)) {
      edgesRemoved++;
      return false;
    }
    return true;
  });

  // -------------------------------------------------------------------------
  // Filter 3: Node Type Restrictions
  // -------------------------------------------------------------------------
  const mappedNodes: FilteredNode[] = filteredNodes.map((node) => {
    let props = (node.properties ?? {}) as Record<string, unknown>;
    const docIds = parseDocIds(node.sourceDocumentIds);

    if (node.nodeType === 'LEGAL_ISSUE') {
      const result = stripProperties(props, LEGAL_ISSUE_ALLOWED_PROPS);
      props = result.cleaned;
      propertiesStripped += result.strippedCount;
    } else if (node.nodeType === 'SETTLEMENT') {
      const result = stripProperties(props, SETTLEMENT_ALLOWED_PROPS);
      props = result.cleaned;
      propertiesStripped += result.strippedCount;
    }

    return {
      id: node.id,
      nodeType: node.nodeType,
      canonicalName: node.canonicalName,
      properties: props,
      personRole: node.personRole,
      orgType: node.orgType,
      confidence: node.confidence,
      confidenceBadge: confidenceLabel(node.confidence),
      sourceCount: docIds.length,
    };
  });

  // -------------------------------------------------------------------------
  // Filter 4: Edge Type Restrictions
  // -------------------------------------------------------------------------
  const mappedEdges: FilteredEdge[] = filteredEdges.map((edge) => {
    let props = (edge.properties ?? {}) as Record<string, unknown>;

    if (edge.edgeType === 'DECIDES' && 'reasoning' in props) {
      const { reasoning: _removed, ...rest } = props;
      props = rest;
      propertiesStripped++;
    }

    return {
      id: edge.id,
      edgeType: edge.edgeType,
      sourceNodeId: edge.sourceNodeId,
      targetNodeId: edge.targetNodeId,
      properties: props,
      confidence: edge.confidence,
      weight: edge.weight,
      contradictionStatus: edge.contradictionStatus,
    };
  });

  // -------------------------------------------------------------------------
  // Sort by confidence descending, apply limits
  // -------------------------------------------------------------------------
  mappedNodes.sort((a, b) => b.confidence - a.confidence);
  mappedEdges.sort((a, b) => b.confidence - a.confidence);

  const limitedNodes = options?.maxNodes
    ? mappedNodes.slice(0, options.maxNodes)
    : mappedNodes;
  const limitedEdges = options?.maxEdges
    ? mappedEdges.slice(0, options.maxEdges)
    : mappedEdges;

  // -------------------------------------------------------------------------
  // Filter 5 (continued): YELLOW zone disclaimer
  // -------------------------------------------------------------------------
  const disclaimer = uplZone === 'YELLOW' ? YELLOW_DISCLAIMER : null;

  const wasFiltered = nodesRemoved > 0 || edgesRemoved > 0 || propertiesStripped > 0;

  return {
    nodes: limitedNodes,
    edges: limitedEdges,
    disclaimer,
    wasFiltered,
    filterStats: {
      nodesRemoved,
      edgesRemoved,
      propertiesStripped,
    },
  };
}

// ---------------------------------------------------------------------------
// formatGraphContext — structured text for chat prompt injection
// ---------------------------------------------------------------------------

/**
 * Format a GraphQueryResult into a structured text block suitable for
 * injection into the examiner chat system prompt.
 *
 * @param result - The filtered graph query result.
 * @returns Human-readable text block, or empty string if no data.
 */
export function formatGraphContext(result: GraphQueryResult): string {
  if (result.nodes.length === 0 && result.edges.length === 0) {
    if (result.disclaimer) {
      return `## CLAIM KNOWLEDGE GRAPH\n\n[${result.disclaimer}]`;
    }
    return '';
  }

  const lines: string[] = ['## CLAIM KNOWLEDGE GRAPH'];

  // -- Key Entities --
  if (result.nodes.length > 0) {
    lines.push('### Key Entities');
    for (const node of result.nodes) {
      const subtype = node.personRole || node.orgType;
      const subtypeStr = subtype ? ` (${subtype})` : '';
      lines.push(`- ${node.nodeType}${subtypeStr}: ${node.canonicalName} [${node.confidenceBadge}]`);
    }
  }

  // -- Key Relationships --
  if (result.edges.length > 0) {
    lines.push('');
    lines.push('### Key Relationships');

    // Build a quick node ID -> name map
    const nodeNameMap = new Map<string, string>();
    for (const node of result.nodes) {
      nodeNameMap.set(node.id, node.canonicalName);
    }

    for (const edge of result.edges) {
      const sourceName = nodeNameMap.get(edge.sourceNodeId) ?? edge.sourceNodeId;
      const targetName = nodeNameMap.get(edge.targetNodeId) ?? edge.targetNodeId;
      lines.push(
        `- ${sourceName} ${edge.edgeType} ${targetName} (confidence: ${edge.confidence.toFixed(2)})`,
      );
    }
  }

  // -- Disclaimer --
  if (result.disclaimer) {
    lines.push('');
    lines.push(`[DISCLAIMER: ${result.disclaimer}]`);
  }

  return lines.join('\n');
}
