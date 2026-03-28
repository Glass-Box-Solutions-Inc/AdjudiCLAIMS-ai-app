/**
 * Graph Traversal Service
 *
 * Provides structured graph queries for the examiner chat — finding relevant
 * subgraphs based on query intent. Supports BFS traversal from a starting node,
 * keyword-based node search, and claim graph summary.
 *
 * All queries are scoped to a single claimId. Edge traversal respects
 * confidence thresholds and neuro-plastic weights.
 */

import type { GraphNodeType, GraphEdgeType } from '@prisma/client';
import { prisma } from '../../db.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TraversalOptions {
  /** Starting node ID or query to find starting node */
  startNodeId?: string;
  /** Node types to include in traversal */
  nodeTypes?: GraphNodeType[];
  /** Edge types to follow */
  edgeTypes?: GraphEdgeType[];
  /** Maximum traversal depth (default 2) */
  maxDepth?: number;
  /** Maximum nodes to return (default 50) */
  maxNodes?: number;
  /** Minimum edge confidence to follow (default 0.3) */
  minConfidence?: number;
}

export interface SubgraphResult {
  nodes: Array<{
    id: string;
    nodeType: GraphNodeType;
    canonicalName: string;
    properties: Record<string, unknown>;
    depth: number; // distance from start node
  }>;
  edges: Array<{
    id: string;
    edgeType: GraphEdgeType;
    sourceNodeId: string;
    targetNodeId: string;
    confidence: number;
    weight: number;
  }>;
}

export interface NodeSearchResult {
  nodeId: string;
  nodeType: GraphNodeType;
  canonicalName: string;
  relevance: number;
}

export interface ClaimGraphSummary {
  totalNodes: number;
  totalEdges: number;
  nodeTypeCounts: Record<string, number>;
  maturityLabel: string;
  maturityScore: number;
}

// ---------------------------------------------------------------------------
// traverseFromNode — BFS traversal from a starting node
// ---------------------------------------------------------------------------

/**
 * BFS traversal from a starting node, returning the reachable subgraph.
 *
 * 1. Start from `startNodeId` (or find the best matching node if not provided)
 * 2. BFS outward following edges (both directions) up to `maxDepth`
 * 3. Filter edges by `minConfidence`
 * 4. Filter by `nodeTypes` and `edgeTypes` if specified
 * 5. Stop when `maxNodes` reached
 * 6. Return the subgraph
 */
export async function traverseFromNode(
  claimId: string,
  options: TraversalOptions,
): Promise<SubgraphResult> {
  const maxDepth = options.maxDepth ?? 2;
  const maxNodes = options.maxNodes ?? 50;
  const minConfidence = options.minConfidence ?? 0.3;

  // If no startNodeId, return empty subgraph (caller should use findNodesByQuery first)
  if (!options.startNodeId) {
    return { nodes: [], edges: [] };
  }

  // Fetch starting node
  const startNode = await prisma.graphNode.findFirst({
    where: { id: options.startNodeId, claimId },
  });

  if (!startNode) {
    return { nodes: [], edges: [] };
  }

  // Check if starting node passes nodeType filter
  if (options.nodeTypes && !options.nodeTypes.includes(startNode.nodeType)) {
    return { nodes: [], edges: [] };
  }

  // BFS state
  const visitedNodeIds = new Set<string>([startNode.id]);
  const resultNodes: SubgraphResult['nodes'] = [
    {
      id: startNode.id,
      nodeType: startNode.nodeType,
      canonicalName: startNode.canonicalName,
      properties: startNode.properties as Record<string, unknown>,
      depth: 0,
    },
  ];
  const resultEdges: SubgraphResult['edges'] = [];
  const collectedEdgeIds = new Set<string>();
  let frontier = [startNode.id];

  for (let depth = 1; depth <= maxDepth; depth++) {
    if (frontier.length === 0 || resultNodes.length >= maxNodes) break;

    // Fetch edges connected to frontier nodes (both directions)
    const edges = await prisma.graphEdge.findMany({
      where: {
        claimId,
        confidence: { gte: minConfidence },
        OR: [
          { sourceNodeId: { in: frontier } },
          { targetNodeId: { in: frontier } },
        ],
        ...(options.edgeTypes ? { edgeType: { in: options.edgeTypes } } : {}),
      },
    });

    const nextFrontier: string[] = [];

    for (const edge of edges) {
      // Collect the edge (deduplicate)
      if (!collectedEdgeIds.has(edge.id)) {
        collectedEdgeIds.add(edge.id);
        resultEdges.push({
          id: edge.id,
          edgeType: edge.edgeType,
          sourceNodeId: edge.sourceNodeId,
          targetNodeId: edge.targetNodeId,
          confidence: edge.confidence,
          weight: edge.weight,
        });
      }

      // Determine the neighbor node ID (could be on either side)
      const neighborId = frontier.includes(edge.sourceNodeId)
        ? edge.targetNodeId
        : edge.sourceNodeId;

      if (!visitedNodeIds.has(neighborId)) {
        nextFrontier.push(neighborId);
        visitedNodeIds.add(neighborId);
      }
    }

    if (nextFrontier.length === 0) break;

    // Fetch the neighbor nodes
    const neighborNodes = await prisma.graphNode.findMany({
      where: {
        id: { in: nextFrontier },
        claimId,
        ...(options.nodeTypes ? { nodeType: { in: options.nodeTypes } } : {}),
      },
    });

    for (const node of neighborNodes) {
      if (resultNodes.length >= maxNodes) break;
      resultNodes.push({
        id: node.id,
        nodeType: node.nodeType,
        canonicalName: node.canonicalName,
        properties: node.properties as Record<string, unknown>,
        depth,
      });
    }

    // Only continue BFS from nodes that actually passed the filter
    const addedIds = new Set(neighborNodes.map((n) => n.id));
    frontier = nextFrontier.filter((id) => addedIds.has(id));
  }

  return { nodes: resultNodes, edges: resultEdges };
}

// ---------------------------------------------------------------------------
// findNodesByQuery — keyword-based node search
// ---------------------------------------------------------------------------

/**
 * Simple keyword-based node search within a claim's graph.
 *
 * 1. Tokenize query into words (3+ chars)
 * 2. Search GraphNode canonicalName and aliases for matches
 * 3. Score by match count / total query words
 * 4. Return sorted by relevance descending
 */
export async function findNodesByQuery(
  claimId: string,
  queryText: string,
): Promise<NodeSearchResult[]> {
  // Tokenize: lowercase, 3+ chars
  const tokens = queryText
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 3);

  if (tokens.length === 0) return [];

  // Fetch all nodes for this claim (graph nodes are relatively small per claim)
  const nodes = await prisma.graphNode.findMany({
    where: { claimId },
    select: {
      id: true,
      nodeType: true,
      canonicalName: true,
      aliases: true,
    },
  });

  const results: NodeSearchResult[] = [];

  for (const node of nodes) {
    const canonicalLower = node.canonicalName.toLowerCase();

    // Build searchable text: canonical name + aliases
    const aliases = Array.isArray(node.aliases)
      ? (node.aliases as string[])
      : [];
    const allNames = [canonicalLower, ...aliases.map((a) => a.toLowerCase())];
    const searchText = allNames.join(' ');

    // Count matching tokens
    let matchCount = 0;
    for (const token of tokens) {
      if (searchText.includes(token)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      results.push({
        nodeId: node.id,
        nodeType: node.nodeType,
        canonicalName: node.canonicalName,
        relevance: matchCount / tokens.length,
      });
    }
  }

  // Sort by relevance descending
  results.sort((a, b) => b.relevance - a.relevance);

  return results;
}

// ---------------------------------------------------------------------------
// getClaimGraphSummary — quick summary of claim graph state
// ---------------------------------------------------------------------------

/**
 * Quick summary of the claim's graph state.
 *
 * 1. Count nodes by type
 * 2. Count total edges
 * 3. Fetch GraphMaturity record
 * 4. Return summary
 */
export async function getClaimGraphSummary(
  claimId: string,
): Promise<ClaimGraphSummary> {
  // Fetch nodes grouped by type
  const nodeGroups = await prisma.graphNode.groupBy({
    by: ['nodeType'],
    where: { claimId },
    _count: { id: true },
  });

  const nodeTypeCounts: Record<string, number> = {};
  let totalNodes = 0;
  for (const group of nodeGroups) {
    nodeTypeCounts[group.nodeType] = group._count.id;
    totalNodes += group._count.id;
  }

  // Count edges
  const totalEdges = await prisma.graphEdge.count({
    where: { claimId },
  });

  // Fetch maturity
  const maturity = await prisma.graphMaturity.findUnique({
    where: { claimId },
  });

  return {
    totalNodes,
    totalEdges,
    nodeTypeCounts,
    maturityLabel: maturity?.maturityLabel ?? 'NASCENT',
    maturityScore: maturity?.overallScore ?? 0,
  };
}
