#!/usr/bin/env npx tsx
/**
 * pg-to-planetscale.ts
 *
 * Data migration script: PostgreSQL → PlanetScale (MySQL/Vitess)
 *
 * Usage:
 *   PG_SOURCE_URL="postgresql://..." MYSQL_TARGET_URL="mysql://..." npx tsx scripts/data-migration/pg-to-planetscale.ts
 *
 * Environment variables:
 *   PG_SOURCE_URL   — PostgreSQL connection string (source)
 *   MYSQL_TARGET_URL — MySQL/PlanetScale connection string (target)
 *
 * MYSQL_TARGET_URL format: mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}
 */

import pg from "pg";
import mysql from "mysql2/promise";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MigrationTable {
  pgTable: string;
  mysqlTable: string;
  /**
   * Fields that are PostgreSQL text[] arrays stored as `{a,b,c}` strings.
   * These must be converted to JSON arrays: ["a","b","c"].
   */
  arrayFields?: string[];
  /** Fields to strip entirely from the export (e.g., embeddings). */
  omitFields?: string[];
  /** Fields that are JSONB in PG and must be re-serialised as JSON strings. */
  jsonbFields?: string[];
  /** Fields that are Decimal/numeric — keep as-is (mysql2 handles them). */
  decimalFields?: string[];
  /** Fields that are booleans in PG — convert to 1/0 for MySQL. */
  booleanFields?: string[];
  /** Date-only fields (PG `date` type) — strip time component. */
  dateOnlyFields?: string[];
}

// ---------------------------------------------------------------------------
// Table migration manifest — dependency order (parents before children)
// ---------------------------------------------------------------------------

const MIGRATION_TABLES: MigrationTable[] = [
  // Tier 1 — no FK dependencies
  {
    pgTable: "organizations",
    mysqlTable: "organizations",
    booleanFields: [],
  },
  // Tier 2 — depends on organizations
  {
    pgTable: "users",
    mysqlTable: "users",
    booleanFields: ["is_active"],
  },
  // Tier 3 — depends on organizations + users
  {
    pgTable: "claims",
    mysqlTable: "claims",
    jsonbFields: ["body_parts"],
    booleanFields: [
      "is_litigated",
      "has_applicant_attorney",
      "is_cumulative_trauma",
    ],
    dateOnlyFields: [
      "date_of_injury",
      "payment_date",
      "period_start",
      "period_end",
      "filing_date",
    ],
    decimalFields: [
      "current_reserve_indemnity",
      "current_reserve_medical",
      "current_reserve_legal",
      "current_reserve_lien",
      "total_paid_indemnity",
      "total_paid_medical",
    ],
  },
  // Tier 4 — depends on claims
  {
    pgTable: "documents",
    mysqlTable: "documents",
    booleanFields: [
      "contains_legal_analysis",
      "contains_work_product",
      "contains_privileged",
    ],
  },
  // Tier 5 — depends on documents
  {
    pgTable: "document_chunks",
    mysqlTable: "document_chunks",
    // Strip embedding column — embeddings live in Vertex AI Vector Search
    omitFields: ["embedding"],
  },
  {
    pgTable: "extracted_fields",
    mysqlTable: "extracted_fields",
  },
  // Tier 6 — depends on claims + users
  {
    pgTable: "chat_sessions",
    mysqlTable: "chat_sessions",
  },
  // Tier 7 — depends on chat_sessions
  {
    pgTable: "chat_messages",
    mysqlTable: "chat_messages",
    booleanFields: ["was_blocked", "disclaimer_applied"],
  },
  // Tier 8 — depends on claims
  {
    pgTable: "regulatory_deadlines",
    mysqlTable: "regulatory_deadlines",
  },
  {
    pgTable: "investigation_items",
    mysqlTable: "investigation_items",
    booleanFields: ["is_complete"],
  },
  {
    pgTable: "benefit_payments",
    mysqlTable: "benefit_payments",
    booleanFields: ["is_late"],
    jsonbFields: ["calculation_inputs"],
    decimalFields: ["amount", "penalty_amount"],
    dateOnlyFields: ["payment_date", "period_start", "period_end"],
  },
  // Tier 9 — depends on users
  {
    pgTable: "education_profiles",
    mysqlTable: "education_profiles",
    booleanFields: ["is_training_complete"],
    jsonbFields: [
      "dismissed_terms",
      "training_modules_completed",
      "acknowledged_changes",
      "monthly_reviews_completed",
      "quarterly_refreshers",
      "audit_training_completed",
    ],
    // Legacy PG array fallback — in case these were stored as text[] before migration
    arrayFields: ["dismissed_terms", "acknowledged_changes"],
  },
  // Tier 10 — depends on claims + users
  {
    pgTable: "audit_events",
    mysqlTable: "audit_events",
    jsonbFields: ["event_data"],
  },
  {
    pgTable: "timeline_events",
    mysqlTable: "timeline_events",
  },
  {
    pgTable: "workflow_progress",
    mysqlTable: "workflow_progress",
    booleanFields: ["is_complete"],
    jsonbFields: ["step_statuses"],
  },
  {
    pgTable: "generated_letters",
    mysqlTable: "generated_letters",
    jsonbFields: ["populated_data"],
  },
  {
    pgTable: "counsel_referrals",
    mysqlTable: "counsel_referrals",
  },
  {
    pgTable: "liens",
    mysqlTable: "liens",
    decimalFields: [
      "total_amount_claimed",
      "total_omfs_allowed",
      "discrepancy_amount",
      "resolved_amount",
    ],
    dateOnlyFields: ["filing_date"],
  },
  {
    pgTable: "lien_line_items",
    mysqlTable: "lien_line_items",
    booleanFields: ["is_overcharge"],
    decimalFields: ["amount_claimed", "omfs_rate", "overcharge_amount"],
    dateOnlyFields: ["service_date"],
  },
];

// ---------------------------------------------------------------------------
// Transformation helpers
// ---------------------------------------------------------------------------

/**
 * Parse a PostgreSQL text[] literal like `{foo,bar,baz}` into a JS string[].
 * If the value is already a JS array or a JSON array string, handle those too.
 */
function parsePgArray(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    const trimmed = value.trim();
    // Already JSON array
    if (trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed) as string[];
      } catch {
        // fall through
      }
    }
    // PostgreSQL array literal: {a,b,c} or {"a","b","c"}
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1);
      if (inner.length === 0) return [];
      // Split on commas respecting quoted strings
      const items: string[] = [];
      let current = "";
      let inQuote = false;
      for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '"') {
          inQuote = !inQuote;
        } else if (ch === "," && !inQuote) {
          items.push(current.replace(/^"|"$/g, ""));
          current = "";
        } else {
          current += ch;
        }
      }
      if (current.length > 0) items.push(current.replace(/^"|"$/g, ""));
      return items;
    }
  }
  return [];
}

/**
 * Convert a PostgreSQL boolean value to MySQL integer (1/0).
 * PG driver returns JS booleans, but handle string representations too.
 */
function boolToInt(value: unknown): 0 | 1 {
  if (value === true || value === 1 || value === "t" || value === "true") {
    return 1;
  }
  return 0;
}

/**
 * Normalise a timestamp for MySQL DATETIME.
 * - Strip fractional seconds beyond microseconds
 * - Return null for null/undefined
 */
function toMysqlDatetime(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return null;
  // Format: YYYY-MM-DD HH:MM:SS (MySQL DATETIME without timezone)
  return d.toISOString().replace("T", " ").replace(/\.\d+Z$/, "");
}

/**
 * Normalise a date-only value to YYYY-MM-DD for MySQL DATE columns.
 */
function toMysqlDate(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return null;
  return d.toISOString().substring(0, 10);
}

/**
 * Serialise a JSONB value to a JSON string for MySQL JSON columns.
 * If it's already a string that looks like JSON, round-trip it to validate.
 * If it's null/undefined, return null.
 */
function jsonbToString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    // Validate and normalise
    try {
      return JSON.stringify(JSON.parse(value));
    } catch {
      // Not valid JSON — wrap as string
      return JSON.stringify(value);
    }
  }
  return JSON.stringify(value);
}

/**
 * Transform a single row from PostgreSQL format to MySQL-compatible values.
 */
function transformRow(
  row: Record<string, unknown>,
  table: MigrationTable
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    // Omit stripped fields
    if (table.omitFields?.includes(key)) continue;

    let transformed: unknown = value;

    // Boolean conversion
    if (table.booleanFields?.includes(key)) {
      transformed = boolToInt(value);
    }
    // Array fields (PG text[] → JSON string)
    else if (table.arrayFields?.includes(key)) {
      // These overlap with jsonbFields — handle array first, produce JSON string
      const arr = parsePgArray(value);
      transformed = JSON.stringify(arr);
    }
    // JSONB fields → JSON string
    else if (table.jsonbFields?.includes(key)) {
      // If the field is ALSO in arrayFields, it was already handled above
      if (!table.arrayFields?.includes(key)) {
        transformed = jsonbToString(value);
      }
    }
    // Date-only fields
    else if (table.dateOnlyFields?.includes(key)) {
      transformed = toMysqlDate(value);
    }
    // Datetime fields (any remaining Date objects)
    else if (value instanceof Date) {
      transformed = toMysqlDatetime(value);
    }
    // Decimal / BigDecimal — mysql2 handles JS numbers and strings fine
    // Convert pg Decimal strings to plain strings
    else if (
      typeof value === "object" &&
      value !== null &&
      "toFixed" in value
    ) {
      transformed = String(value);
    }

    result[key] = transformed;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Bulk insert with ON DUPLICATE KEY UPDATE (upsert — skip on conflict)
// ---------------------------------------------------------------------------

const BATCH_SIZE = 500;

async function bulkInsert(
  conn: mysql.Connection,
  tableName: string,
  rows: Record<string, unknown>[]
): Promise<{ inserted: number; skipped: number }> {
  if (rows.length === 0) return { inserted: 0, skipped: 0 };

  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => "?").join(", ");
  const columnList = columns.map((c) => `\`${c}\``).join(", ");

  // INSERT IGNORE skips rows that violate unique/PK constraints (idempotent)
  const sql = `INSERT IGNORE INTO \`${tableName}\` (${columnList}) VALUES (${placeholders})`;

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = batch.map((row) => columns.map((col) => row[col]));

    // Execute batch one row at a time for reliable affected-rows counting
    // (mysql2 doesn't do true executeBatch for INSERT IGNORE affectedRows)
    for (const rowValues of values) {
      const [result] = await conn.execute<mysql.ResultSetHeader>(sql, rowValues);
      if (result.affectedRows > 0) {
        inserted++;
      } else {
        skipped++;
      }
    }
  }

  return { inserted, skipped };
}

// ---------------------------------------------------------------------------
// Main migration
// ---------------------------------------------------------------------------

async function migrate(): Promise<void> {
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
  console.log("AdjudiCLAIMS: PostgreSQL → PlanetScale Migration");
  console.log("=".repeat(70));
  console.log(`Started: ${new Date().toISOString()}\n`);

  // Connect to PostgreSQL
  const pgClient = new pg.Client({ connectionString: pgUrl });
  await pgClient.connect();
  console.log("Connected to PostgreSQL source.");

  // Parse MySQL URL for mysql2 (which expects an options object or URL string)
  // PlanetScale requires SSL
  const mysqlConn = await mysql.createConnection(mysqlUrl);
  console.log("Connected to PlanetScale/MySQL target.");
  console.log();

  const summary: Array<{
    table: string;
    sourceCount: number;
    inserted: number;
    skipped: number;
    durationMs: number;
    status: "OK" | "ERROR";
    error?: string;
  }> = [];

  try {
    for (const tableDef of MIGRATION_TABLES) {
      const { pgTable, mysqlTable } = tableDef;
      const tableStart = Date.now();

      process.stdout.write(`Migrating ${pgTable}... `);

      try {
        // Fetch all rows from PostgreSQL
        const { rows } = await pgClient.query<Record<string, unknown>>(
          `SELECT * FROM "${pgTable}"`
        );
        const sourceCount = rows.length;

        if (sourceCount === 0) {
          const duration = Date.now() - tableStart;
          console.log(`0 rows — skipped (${duration}ms)`);
          summary.push({
            table: pgTable,
            sourceCount: 0,
            inserted: 0,
            skipped: 0,
            durationMs: duration,
            status: "OK",
          });
          continue;
        }

        // Transform rows
        const transformed = rows.map((row) => transformRow(row, tableDef));

        // Insert with transaction per table
        await mysqlConn.beginTransaction();
        try {
          const { inserted, skipped } = await bulkInsert(
            mysqlConn,
            mysqlTable,
            transformed
          );
          await mysqlConn.commit();

          const duration = Date.now() - tableStart;
          console.log(
            `${sourceCount} rows → ${inserted} inserted, ${skipped} skipped (${duration}ms)`
          );
          summary.push({
            table: pgTable,
            sourceCount,
            inserted,
            skipped,
            durationMs: duration,
            status: "OK",
          });
        } catch (insertErr) {
          await mysqlConn.rollback();
          throw insertErr;
        }
      } catch (err) {
        const duration = Date.now() - tableStart;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.log(`ERROR — ${errMsg} (${duration}ms)`);
        summary.push({
          table: pgTable,
          sourceCount: 0,
          inserted: 0,
          skipped: 0,
          durationMs: duration,
          status: "ERROR",
          error: errMsg,
        });
      }
    }
  } finally {
    await pgClient.end();
    await mysqlConn.end();
    console.log("\nConnections closed.");
  }

  // ---------------------------------------------------------------------------
  // Summary report
  // ---------------------------------------------------------------------------
  console.log("\n" + "=".repeat(70));
  console.log("MIGRATION SUMMARY");
  console.log("=".repeat(70));

  const totalSource = summary.reduce((s, r) => s + r.sourceCount, 0);
  const totalInserted = summary.reduce((s, r) => s + r.inserted, 0);
  const totalSkipped = summary.reduce((s, r) => s + r.skipped, 0);
  const errors = summary.filter((r) => r.status === "ERROR");

  console.log(
    `${"Table".padEnd(30)} ${"Source".padStart(8)} ${"Inserted".padStart(10)} ${"Skipped".padStart(9)} ${"ms".padStart(8)} Status`
  );
  console.log("-".repeat(75));

  for (const row of summary) {
    const status = row.status === "ERROR" ? `ERROR: ${row.error}` : "OK";
    console.log(
      `${row.table.padEnd(30)} ${String(row.sourceCount).padStart(8)} ${String(row.inserted).padStart(10)} ${String(row.skipped).padStart(9)} ${String(row.durationMs).padStart(8)} ${status}`
    );
  }

  console.log("-".repeat(75));
  console.log(
    `${"TOTAL".padEnd(30)} ${String(totalSource).padStart(8)} ${String(totalInserted).padStart(10)} ${String(totalSkipped).padStart(9)}`
  );
  console.log(`\nCompleted: ${new Date().toISOString()}`);

  if (errors.length > 0) {
    console.error(
      `\n${errors.length} table(s) failed. Review errors above before proceeding.`
    );
    process.exit(1);
  } else {
    console.log("\nAll tables migrated successfully.");
  }
}

migrate().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
