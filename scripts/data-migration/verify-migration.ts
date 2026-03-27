#!/usr/bin/env npx tsx
/**
 * verify-migration.ts
 *
 * Post-migration verification: PostgreSQL → PlanetScale (MySQL/Vitess)
 *
 * Usage:
 *   PG_SOURCE_URL="postgresql://..." MYSQL_TARGET_URL="mysql://..." npx tsx scripts/data-migration/verify-migration.ts
 *
 * Checks per table:
 *   - Row count match
 *   - Sample 100 random records — field-level comparison
 *   - Financial Decimal fields: precision to 2 decimal places
 *   - JSON array fields parse correctly
 *   - Timestamps: within 1-second tolerance
 *
 * Document-specific integrity:
 *   - All documents with extracted_text have at least one chunk
 *   - Chunk indexes are sequential (0-based, no gaps) per document
 *
 * Exit code: 0 = PASS, 1 = FAIL
 */

import pg from "pg";
import mysql from "mysql2/promise";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TableSpec {
  pgTable: string;
  mysqlTable: string;
  /** Primary key column (used for sampling). */
  pkColumn?: string;
  /** Decimal fields — compare to 2 decimal places. */
  decimalFields?: string[];
  /** JSON/array fields — parse and compare structurally. */
  jsonFields?: string[];
  /** Timestamp fields — compare within 1-second tolerance. */
  timestampFields?: string[];
  /** Date-only fields — compare as YYYY-MM-DD strings. */
  dateFields?: string[];
  /** Boolean fields — PG returns JS bool, MySQL returns 0/1. Normalise before compare. */
  booleanFields?: string[];
  /** Fields omitted during migration (e.g., embedding). Skip comparison. */
  omitFields?: string[];
}

interface TableResult {
  table: string;
  sourceCount: number;
  targetCount: number;
  countMatch: boolean;
  sampleSize: number;
  samplePassed: number;
  sampleFailed: number;
  failures: string[];
  status: "PASS" | "FAIL" | "ERROR";
  error?: string;
}

interface IntegrityResult {
  check: string;
  status: "PASS" | "FAIL" | "ERROR";
  detail: string;
}

// ---------------------------------------------------------------------------
// Table specs
// ---------------------------------------------------------------------------

const TABLE_SPECS: TableSpec[] = [
  {
    pgTable: "organizations",
    mysqlTable: "organizations",
    pkColumn: "id",
    timestampFields: ["created_at", "updated_at"],
  },
  {
    pgTable: "users",
    mysqlTable: "users",
    pkColumn: "id",
    booleanFields: ["is_active"],
    timestampFields: ["created_at", "updated_at"],
  },
  {
    pgTable: "claims",
    mysqlTable: "claims",
    pkColumn: "id",
    jsonFields: ["body_parts"],
    decimalFields: [
      "current_reserve_indemnity",
      "current_reserve_medical",
      "current_reserve_legal",
      "current_reserve_lien",
      "total_paid_indemnity",
      "total_paid_medical",
    ],
    booleanFields: [
      "is_litigated",
      "has_applicant_attorney",
      "is_cumulative_trauma",
    ],
    dateFields: ["date_of_injury"],
    timestampFields: [
      "date_received",
      "date_acknowledged",
      "date_determined",
      "date_closed",
      "created_at",
      "updated_at",
    ],
  },
  {
    pgTable: "documents",
    mysqlTable: "documents",
    pkColumn: "id",
    booleanFields: [
      "contains_legal_analysis",
      "contains_work_product",
      "contains_privileged",
    ],
    timestampFields: ["created_at", "updated_at"],
  },
  {
    pgTable: "document_chunks",
    mysqlTable: "document_chunks",
    pkColumn: "id",
    omitFields: ["embedding"],
  },
  {
    pgTable: "extracted_fields",
    mysqlTable: "extracted_fields",
    pkColumn: "id",
  },
  {
    pgTable: "chat_sessions",
    mysqlTable: "chat_sessions",
    pkColumn: "id",
    timestampFields: ["created_at"],
  },
  {
    pgTable: "chat_messages",
    mysqlTable: "chat_messages",
    pkColumn: "id",
    booleanFields: ["was_blocked", "disclaimer_applied"],
    timestampFields: ["created_at"],
  },
  {
    pgTable: "regulatory_deadlines",
    mysqlTable: "regulatory_deadlines",
    pkColumn: "id",
    timestampFields: ["created_at", "completed_at", "due_date"],
  },
  {
    pgTable: "investigation_items",
    mysqlTable: "investigation_items",
    pkColumn: "id",
    booleanFields: ["is_complete"],
    timestampFields: ["completed_at"],
  },
  {
    pgTable: "benefit_payments",
    mysqlTable: "benefit_payments",
    pkColumn: "id",
    decimalFields: ["amount", "penalty_amount"],
    booleanFields: ["is_late"],
    jsonFields: ["calculation_inputs"],
    dateFields: ["payment_date", "period_start", "period_end"],
    timestampFields: ["created_at"],
  },
  {
    pgTable: "education_profiles",
    mysqlTable: "education_profiles",
    pkColumn: "id",
    booleanFields: ["is_training_complete"],
    jsonFields: [
      "dismissed_terms",
      "training_modules_completed",
      "acknowledged_changes",
      "monthly_reviews_completed",
      "quarterly_refreshers",
      "audit_training_completed",
    ],
    timestampFields: [
      "created_at",
      "updated_at",
      "learning_mode_expiry",
      "last_recertification_date",
    ],
  },
  {
    pgTable: "audit_events",
    mysqlTable: "audit_events",
    pkColumn: "id",
    jsonFields: ["event_data"],
    timestampFields: ["created_at"],
  },
  {
    pgTable: "timeline_events",
    mysqlTable: "timeline_events",
    pkColumn: "id",
    timestampFields: ["event_date"],
  },
  {
    pgTable: "workflow_progress",
    mysqlTable: "workflow_progress",
    pkColumn: "id",
    booleanFields: ["is_complete"],
    jsonFields: ["step_statuses"],
    timestampFields: ["started_at", "completed_at"],
  },
  {
    pgTable: "generated_letters",
    mysqlTable: "generated_letters",
    pkColumn: "id",
    jsonFields: ["populated_data"],
    timestampFields: ["created_at"],
  },
  {
    pgTable: "counsel_referrals",
    mysqlTable: "counsel_referrals",
    pkColumn: "id",
    timestampFields: ["created_at", "updated_at", "responded_at"],
  },
  {
    pgTable: "liens",
    mysqlTable: "liens",
    pkColumn: "id",
    decimalFields: [
      "total_amount_claimed",
      "total_omfs_allowed",
      "discrepancy_amount",
      "resolved_amount",
    ],
    dateFields: ["filing_date"],
    timestampFields: ["created_at", "updated_at", "resolved_at"],
  },
  {
    pgTable: "lien_line_items",
    mysqlTable: "lien_line_items",
    pkColumn: "id",
    decimalFields: ["amount_claimed", "omfs_rate", "overcharge_amount"],
    booleanFields: ["is_overcharge"],
    dateFields: ["service_date"],
  },
];

// ---------------------------------------------------------------------------
// Comparison helpers
// ---------------------------------------------------------------------------

function normaliseBoolean(value: unknown): number {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return 1;
  }
  return 0;
}

function normaliseDecimal(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  if (isNaN(n)) return null;
  return n.toFixed(2);
}

function normaliseTimestamp(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return null;
  return d.getTime();
}

function normaliseDate(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return null;
  return d.toISOString().substring(0, 10);
}

/**
 * Parse a JSON field from either database.
 * PG returns JS objects; MySQL may return strings or objects depending on version.
 * Returns a stable JSON-stringified form for comparison.
 */
function normaliseJson(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value));
    } catch {
      // Try treating as PostgreSQL array literal
      if (value.trim().startsWith("{")) {
        return JSON.stringify(parsePgArrayFallback(value));
      }
      return JSON.stringify(value);
    }
  }
  return JSON.stringify(value);
}

/** Minimal PG array parser for verification fallback. */
function parsePgArrayFallback(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return [value];
  const inner = trimmed.slice(1, -1);
  if (inner.length === 0) return [];
  return inner.split(",").map((s) => s.replace(/^"|"$/g, "").trim());
}

/**
 * Compare a source (PG) value to a target (MySQL) value given the field type context.
 * Returns null if equal, or a descriptive mismatch string if not.
 */
function compareField(
  field: string,
  pgValue: unknown,
  mysqlValue: unknown,
  spec: TableSpec
): string | null {
  // Omitted fields — skip
  if (spec.omitFields?.includes(field)) return null;

  // Null / null equality
  const pgNull = pgValue === null || pgValue === undefined;
  const myNull = mysqlValue === null || mysqlValue === undefined;
  if (pgNull && myNull) return null;
  if (pgNull !== myNull) {
    return `${field}: nullability mismatch (pg=${pgNull ? "NULL" : "NOT NULL"}, mysql=${myNull ? "NULL" : "NOT NULL"})`;
  }

  // Boolean fields
  if (spec.booleanFields?.includes(field)) {
    const pgBool = normaliseBoolean(pgValue);
    const myBool = normaliseBoolean(mysqlValue);
    if (pgBool !== myBool) {
      return `${field}: boolean mismatch (pg=${pgBool}, mysql=${myBool})`;
    }
    return null;
  }

  // Decimal fields
  if (spec.decimalFields?.includes(field)) {
    const pgDec = normaliseDecimal(pgValue);
    const myDec = normaliseDecimal(mysqlValue);
    if (pgDec !== myDec) {
      return `${field}: decimal mismatch (pg=${pgDec}, mysql=${myDec})`;
    }
    return null;
  }

  // JSON fields
  if (spec.jsonFields?.includes(field)) {
    const pgJson = normaliseJson(pgValue);
    const myJson = normaliseJson(mysqlValue);
    if (pgJson !== myJson) {
      return `${field}: JSON mismatch (pg=${pgJson?.substring(0, 80)}, mysql=${myJson?.substring(0, 80)})`;
    }
    return null;
  }

  // Timestamp fields — within 1-second tolerance
  if (spec.timestampFields?.includes(field)) {
    const pgTs = normaliseTimestamp(pgValue);
    const myTs = normaliseTimestamp(mysqlValue);
    if (pgTs === null && myTs === null) return null;
    if (pgTs === null || myTs === null) {
      return `${field}: timestamp nullability mismatch`;
    }
    const diffMs = Math.abs(pgTs - myTs);
    if (diffMs > 1000) {
      return `${field}: timestamp mismatch — diff ${diffMs}ms (pg=${new Date(pgTs).toISOString()}, mysql=${new Date(myTs).toISOString()})`;
    }
    return null;
  }

  // Date-only fields
  if (spec.dateFields?.includes(field)) {
    const pgDate = normaliseDate(pgValue);
    const myDate = normaliseDate(mysqlValue);
    if (pgDate !== myDate) {
      return `${field}: date mismatch (pg=${pgDate}, mysql=${myDate})`;
    }
    return null;
  }

  // Default — string equality (handles enums, IDs, text fields)
  const pgStr = pgValue instanceof Date ? pgValue.toISOString() : String(pgValue);
  const myStr = mysqlValue instanceof Date ? mysqlValue.toISOString() : String(mysqlValue);
  if (pgStr !== myStr) {
    const pgTrunc = pgStr.substring(0, 100);
    const myTrunc = myStr.substring(0, 100);
    return `${field}: value mismatch (pg="${pgTrunc}", mysql="${myTrunc}")`;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Per-table verification
// ---------------------------------------------------------------------------

const SAMPLE_SIZE = 100;

async function verifyTable(
  pgClient: pg.Client,
  mysqlConn: mysql.Connection,
  spec: TableSpec
): Promise<TableResult> {
  const result: TableResult = {
    table: spec.pgTable,
    sourceCount: 0,
    targetCount: 0,
    countMatch: false,
    sampleSize: 0,
    samplePassed: 0,
    sampleFailed: 0,
    failures: [],
    status: "PASS",
  };

  try {
    // Count comparison
    const pgCount = await pgClient
      .query<{ count: string }>(`SELECT COUNT(*) AS count FROM "${spec.pgTable}"`)
      .then((r) => parseInt(r.rows[0].count, 10));

    const [mysqlCountRows] = await mysqlConn.execute<mysql.RowDataPacket[]>(
      `SELECT COUNT(*) AS count FROM \`${spec.mysqlTable}\``
    );
    const mysqlCount = parseInt(String((mysqlCountRows[0] as mysql.RowDataPacket)["count"]), 10);

    result.sourceCount = pgCount;
    result.targetCount = mysqlCount;
    result.countMatch = pgCount === mysqlCount;

    if (!result.countMatch) {
      result.failures.push(
        `Row count mismatch: source=${pgCount}, target=${mysqlCount}`
      );
    }

    if (pgCount === 0) {
      result.status = result.countMatch ? "PASS" : "FAIL";
      return result;
    }

    // Sample 100 random records from PostgreSQL, then look them up in MySQL
    const pk = spec.pkColumn ?? "id";
    const sampleSize = Math.min(SAMPLE_SIZE, pgCount);
    const pgSampleRows = await pgClient
      .query<Record<string, unknown>>(
        `SELECT * FROM "${spec.pgTable}" ORDER BY random() LIMIT $1`,
        [sampleSize]
      )
      .then((r) => r.rows);

    result.sampleSize = pgSampleRows.length;

    for (const pgRow of pgSampleRows) {
      const pkValue = pgRow[pk];
      if (pkValue === null || pkValue === undefined) {
        result.failures.push(`Row with NULL primary key in ${spec.pgTable}`);
        result.sampleFailed++;
        continue;
      }

      // Fetch matching row from MySQL
      const [mysqlRows] = await mysqlConn.execute<mysql.RowDataPacket[]>(
        `SELECT * FROM \`${spec.mysqlTable}\` WHERE \`${pk}\` = ?`,
        [pkValue]
      );

      if ((mysqlRows as mysql.RowDataPacket[]).length === 0) {
        result.failures.push(`Row not found in MySQL: ${pk}=${pkValue}`);
        result.sampleFailed++;
        continue;
      }

      const mysqlRow = (mysqlRows as mysql.RowDataPacket[])[0] as Record<string, unknown>;

      // Field-level comparison
      const rowFailures: string[] = [];
      for (const field of Object.keys(pgRow)) {
        if (spec.omitFields?.includes(field)) continue;
        const mismatch = compareField(field, pgRow[field], mysqlRow[field], spec);
        if (mismatch) {
          rowFailures.push(mismatch);
        }
      }

      if (rowFailures.length > 0) {
        result.sampleFailed++;
        for (const f of rowFailures) {
          result.failures.push(`[${pk}=${pkValue}] ${f}`);
        }
      } else {
        result.samplePassed++;
      }
    }
  } catch (err) {
    result.status = "ERROR";
    result.error = err instanceof Error ? err.message : String(err);
    return result;
  }

  result.status =
    result.countMatch && result.sampleFailed === 0 ? "PASS" : "FAIL";
  return result;
}

// ---------------------------------------------------------------------------
// Document integrity checks
// ---------------------------------------------------------------------------

async function verifyDocumentIntegrity(
  pgClient: pg.Client,
  mysqlConn: mysql.Connection
): Promise<IntegrityResult[]> {
  const results: IntegrityResult[] = [];

  // Check 1: All documents with extracted_text have at least one chunk in MySQL
  try {
    const pgDocsWithText = await pgClient
      .query<{ id: string }>(
        `SELECT id FROM "documents" WHERE extracted_text IS NOT NULL AND extracted_text <> ''`
      )
      .then((r) => r.rows.map((row) => row.id));

    if (pgDocsWithText.length === 0) {
      results.push({
        check: "Documents with text have chunks",
        status: "PASS",
        detail: "No documents with extracted_text in source.",
      });
    } else {
      let missingChunks = 0;
      const missingIds: string[] = [];

      // Batch the check for efficiency
      const batchSize = 200;
      for (let i = 0; i < pgDocsWithText.length; i += batchSize) {
        const batch = pgDocsWithText.slice(i, i + batchSize);
        const placeholders = batch.map(() => "?").join(",");
        const [rows] = await mysqlConn.execute<mysql.RowDataPacket[]>(
          `SELECT document_id FROM document_chunks WHERE document_id IN (${placeholders}) GROUP BY document_id`,
          batch
        );
        const withChunks = new Set(
          (rows as mysql.RowDataPacket[]).map((r) => String(r["document_id"]))
        );
        for (const docId of batch) {
          if (!withChunks.has(docId)) {
            missingChunks++;
            if (missingIds.length < 10) missingIds.push(docId);
          }
        }
      }

      if (missingChunks === 0) {
        results.push({
          check: "Documents with text have chunks",
          status: "PASS",
          detail: `All ${pgDocsWithText.length} documents with extracted_text have chunks in MySQL.`,
        });
      } else {
        results.push({
          check: "Documents with text have chunks",
          status: "FAIL",
          detail: `${missingChunks} document(s) missing chunks. First 10 IDs: ${missingIds.join(", ")}`,
        });
      }
    }
  } catch (err) {
    results.push({
      check: "Documents with text have chunks",
      status: "ERROR",
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // Check 2: Chunk indexes are sequential (0-based, no gaps) per document in MySQL
  try {
    // Find documents where chunk_index doesn't run 0..N-1 without gaps
    const [gapRows] = await mysqlConn.execute<mysql.RowDataPacket[]>(`
      SELECT
        dc.document_id,
        COUNT(*) AS chunk_count,
        MIN(dc.chunk_index) AS min_idx,
        MAX(dc.chunk_index) AS max_idx
      FROM document_chunks dc
      GROUP BY dc.document_id
      HAVING
        MIN(dc.chunk_index) <> 0
        OR MAX(dc.chunk_index) <> COUNT(*) - 1
      LIMIT 20
    `);

    if ((gapRows as mysql.RowDataPacket[]).length === 0) {
      results.push({
        check: "Chunk indexes are sequential (0-based)",
        status: "PASS",
        detail: "All document chunk sequences are gap-free and 0-based.",
      });
    } else {
      const examples = (gapRows as mysql.RowDataPacket[])
        .slice(0, 5)
        .map(
          (r) =>
            `doc_id=${r["document_id"]} count=${r["chunk_count"]} min=${r["min_idx"]} max=${r["max_idx"]}`
        )
        .join("; ");
      results.push({
        check: "Chunk indexes are sequential (0-based)",
        status: "FAIL",
        detail: `${(gapRows as mysql.RowDataPacket[]).length} document(s) have non-sequential chunk indexes. Examples: ${examples}`,
      });
    }
  } catch (err) {
    results.push({
      check: "Chunk indexes are sequential (0-based)",
      status: "ERROR",
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main verification
// ---------------------------------------------------------------------------

async function verify(): Promise<void> {
  const pgUrl = process.env.PG_SOURCE_URL;
  const mysqlUrl = process.env.MYSQL_TARGET_URL;

  if (!pgUrl) {
    console.error("ERROR: PG_SOURCE_URL environment variable is not set.");
    process.exit(1);
  }
  if (!mysqlUrl) {
    console.error("ERROR: MYSQL_TARGET_URL environment variable is not set.");
    process.exit(1);
  }

  console.log("=".repeat(70));
  console.log("AdjudiCLAIMS: Migration Verification Report");
  console.log("=".repeat(70));
  console.log(`Started: ${new Date().toISOString()}\n`);

  const pgClient = new pg.Client({ connectionString: pgUrl });
  await pgClient.connect();
  console.log("Connected to PostgreSQL source.");

  const mysqlConn = await mysql.createConnection(mysqlUrl);
  console.log("Connected to PlanetScale/MySQL target.");
  console.log();

  const tableResults: TableResult[] = [];
  const integrityResults: IntegrityResult[] = [];

  try {
    // Per-table verification
    for (const spec of TABLE_SPECS) {
      process.stdout.write(`Verifying ${spec.pgTable}... `);
      const result = await verifyTable(pgClient, mysqlConn, spec);
      tableResults.push(result);

      if (result.status === "PASS") {
        console.log(
          `PASS (${result.sourceCount} rows, ${result.samplePassed}/${result.sampleSize} samples OK)`
        );
      } else if (result.status === "ERROR") {
        console.log(`ERROR — ${result.error}`);
      } else {
        console.log(
          `FAIL — ${result.failures.length} issue(s), count_match=${result.countMatch}, sample_failed=${result.sampleFailed}`
        );
      }
    }

    // Document integrity checks
    console.log("\nRunning document integrity checks...");
    const docIntegrity = await verifyDocumentIntegrity(pgClient, mysqlConn);
    integrityResults.push(...docIntegrity);
    for (const r of docIntegrity) {
      const statusPad = r.status.padEnd(5);
      console.log(`  [${statusPad}] ${r.check}: ${r.detail}`);
    }
  } finally {
    await pgClient.end();
    await mysqlConn.end();
    console.log("\nConnections closed.");
  }

  // ---------------------------------------------------------------------------
  // Full structured report
  // ---------------------------------------------------------------------------
  console.log("\n" + "=".repeat(70));
  console.log("VERIFICATION REPORT — TABLE SUMMARY");
  console.log("=".repeat(70));

  const headerCols = [
    "Table".padEnd(28),
    "Src".padStart(7),
    "Tgt".padStart(7),
    "CntOK".padStart(6),
    "Smp".padStart(5),
    "Pass".padStart(5),
    "Fail".padStart(5),
    "Status",
  ].join(" ");
  console.log(headerCols);
  console.log("-".repeat(75));

  for (const r of tableResults) {
    const cntOk = r.countMatch ? "YES" : "NO ";
    const statusStr = r.status === "ERROR" ? `ERROR: ${r.error}` : r.status;
    console.log(
      [
        r.table.padEnd(28),
        String(r.sourceCount).padStart(7),
        String(r.targetCount).padStart(7),
        cntOk.padStart(6),
        String(r.sampleSize).padStart(5),
        String(r.samplePassed).padStart(5),
        String(r.sampleFailed).padStart(5),
        statusStr,
      ].join(" ")
    );
  }

  console.log("-".repeat(75));

  // Failure details
  const failedTables = tableResults.filter(
    (r) => r.status !== "PASS" && r.failures.length > 0
  );
  if (failedTables.length > 0) {
    console.log("\nFAILURE DETAILS:");
    for (const r of failedTables) {
      console.log(`\n  Table: ${r.table}`);
      for (const f of r.failures.slice(0, 20)) {
        console.log(`    - ${f}`);
      }
      if (r.failures.length > 20) {
        console.log(`    ... and ${r.failures.length - 20} more failures.`);
      }
    }
  }

  // Integrity check summary
  console.log("\n" + "=".repeat(70));
  console.log("DOCUMENT INTEGRITY CHECKS");
  console.log("=".repeat(70));
  for (const r of integrityResults) {
    console.log(`  [${r.status}] ${r.check}`);
    console.log(`         ${r.detail}`);
  }

  // Overall verdict
  const allTablesPassed = tableResults.every((r) => r.status === "PASS");
  const allIntegrityPassed = integrityResults.every((r) => r.status === "PASS");
  const overallPass = allTablesPassed && allIntegrityPassed;

  const totalSource = tableResults.reduce((s, r) => s + r.sourceCount, 0);
  const totalTarget = tableResults.reduce((s, r) => s + r.targetCount, 0);
  const totalSampleFailed = tableResults.reduce(
    (s, r) => s + r.sampleFailed,
    0
  );

  console.log("\n" + "=".repeat(70));
  console.log("OVERALL RESULT");
  console.log("=".repeat(70));
  console.log(`Total source rows:  ${totalSource}`);
  console.log(`Total target rows:  ${totalTarget}`);
  console.log(`Sample failures:    ${totalSampleFailed}`);
  console.log(
    `Tables passed:      ${tableResults.filter((r) => r.status === "PASS").length} / ${tableResults.length}`
  );
  console.log(
    `Integrity checks:   ${integrityResults.filter((r) => r.status === "PASS").length} / ${integrityResults.length}`
  );
  console.log(`\nResult: ${overallPass ? "PASS" : "FAIL"}`);
  console.log(`Completed: ${new Date().toISOString()}`);

  process.exit(overallPass ? 0 : 1);
}

verify().catch((err) => {
  console.error("Fatal verification error:", err);
  process.exit(1);
});
