# Workers' Compensation Knowledge Base — Technical Operations

**Document Version:** 1.0
**Last Updated:** February 13, 2026
**Status:** Active Operations
**Related Systems:** Legal Research Backend, Knowledge Base Dashboard

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Quality Audit & Case Mismatch Discovery](#2-quality-audit--case-mismatch-discovery)
3. [Case PDF Finding Operation](#3-case-pdf-finding-operation)
4. [3-Layer Team Architecture](#4-3-layer-team-architecture)
5. [Search Strategies & Data Sources](#5-search-strategies--data-sources)
6. [Operational Procedures](#6-operational-procedures)
7. [Monitoring & Progress Tracking](#7-monitoring--progress-tracking)
8. [Post-Search Pipeline](#8-post-search-pipeline)
9. [Known Issues & Resolutions](#9-known-issues--resolutions)
10. [Future Improvements](#10-future-improvements)

---

## 1. System Overview

### 1.1 Purpose

The Workers' Compensation Knowledge Base is a comprehensive legal research system containing **2,217 California Workers' Compensation cases** with AI-extracted IRAC briefs (Issue, Rule, Application, Conclusion). The system enables attorneys to quickly research case law, identify relevant precedents, and understand legal principles.

### 1.2 Technical Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | NestJS 10.3 | API server, case management |
| **Database** | PostgreSQL + Prisma | Case storage, audit results |
| **Frontend** | React 19 | Dashboard for case browsing |
| **AI Processing** | Gemini 2.5 Flash | AI-powered IRAC extraction and quality auditing |
| **Job Queue** | BullMQ + Redis | Asynchronous processing |
| **Search** | pgvector + Vertex AI embeddings | Semantic case search (768-dim) |
| **Deployment** | Google Cloud Run | Production environment |

### 1.3 Data Flow

```
PDF Download → OCR Extraction → Gemini IRAC Analysis → Database Storage
                                         ↓
                                Quality Audit (Parallel AI Workers)
                                         ↓
                         Mismatch Detection & Correction Pipeline
```

### 1.4 Scale

- **Total Cases:** 2,217
- **Data Sources:** DIR WCAB, CourtListener, Justia, Stanford SCOCAL, Google Scholar
- **Processing Rate:** ~50 cases/hour for IRAC extraction
- **Audit Rate:** ~200 cases/hour (parallel workers)
- **Storage:** ~15 GB PDFs, ~500 MB structured data

---

## 2. Quality Audit & Case Mismatch Discovery

### 2.1 Audit Methodology (February 12, 2026)

A comprehensive quality audit was conducted using parallel AI workers to score each case on three dimensions:

| Dimension | Description | Weight |
|-----------|-------------|--------|
| **IRAC Accuracy** | How well the extracted IRAC matches the actual case content | 40% |
| **External Validation** | Agreement with external legal sources (Justia, CourtListener) | 40% |
| **Text Quality** | OCR accuracy, formatting, completeness | 20% |

**AI Model Used:**
- Gemini 2.5 Flash (speed + accuracy)

Scoring based on Gemini analysis with structured evaluation prompts.

### 2.2 Audit Results

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Cases Audited | 2,200 | 100% |
| Passed Quality Threshold | 1,793 | 81.5% |
| Failed Quality Threshold | 407 | 18.5% |
| **Complete Mismatches** | **635** | **28.9%** |
| Need Re-Extraction | 1,336 | 60.7% |
| Flagged for Human Review | 1,113 | 50.6% |

**Average Quality Score:** 73.3%

### 2.3 What is a "Complete Mismatch"?

A complete mismatch occurs when:
- The extracted IRAC brief describes a **different case** than the one identified in the database
- The PDF that was downloaded and OCR'd belonged to a case with a similar name, the same citation, or was simply a linking error
- External sources (Justia, CourtListener) describe a completely different legal issue than what appears in our extracted brief

**Example:**
```
Database Entry: "Gisela Bustos v. ABM Industries"
Our Brief Says: Case about apportionment and Benson rule application
External Sources Say: Case about due process and arbitration record completeness
Diagnosis: WRONG PDF was downloaded — our PDF is actually a different Bustos case
```

### 2.4 Root Causes

| Cause | Frequency | Description |
|-------|-----------|-------------|
| Similar case names | 40% | Multiple cases with same parties, different ADJ numbers |
| Citation errors | 25% | Database linked to wrong citation |
| Court level confusion | 15% | WCAB panel decision vs. Court of Appeal opinion |
| Name variations | 10% | "John Doe" vs. "Johnny Doe" vs. "J. Doe" |
| Data entry errors | 10% | Manual errors during initial data collection |

---

## 3. Case PDF Finding Operation

### 3.1 Problem Statement

For the 635 mismatched cases, the correct PDF must be found and downloaded so the case can be re-extracted with accurate content.

**Constraints:**
- Only **freely available public sources** (no paid legal databases like Westlaw or LexisNexis)
- Must verify the PDF matches the expected legal issue before accepting it
- Must handle diverse case types (WCAB panel, en banc, significant panel, Court of Appeal, Supreme Court)

### 3.2 Evolution of Approaches

#### 3.2.1 Static Approach (Failed)

**Method:** `scripts/lib/correct-case-finder.ts` with hardcoded URL patterns and API queries.

**Results:** 4 cases processed, 0 found. The static approach couldn't handle the diversity of case types and URL patterns.

**Why it failed:**
- Too rigid — couldn't adapt to different naming conventions
- No reasoning about where a case might be located
- Couldn't interpret search results or follow links

#### 3.2.2 Flat Parallel Agents (Partially Successful, Context Issues)

**Method:** Spawn 10 agents in parallel per batch, each searching for one case using WebSearch/WebFetch.

**Results:**
- Batches 1-3: 30 cases, 16 found (53% success rate)
- Batches 4-6: ~30 cases, ~14 found, but context crashed before results could be saved

**Why it had issues:**
- Main context filled rapidly collecting 10-30 agent results (~2-5k tokens each)
- After 30 agents, context crash occurred
- Results had to be recovered from raw JSONL transcripts

#### 3.2.3 Single Sequential Agent (Hit API Limits)

**Method:** One agent processing cases sequentially in a loop.

**Results:** 1 case processed before hitting API usage limits.

**Why it failed:**
- Single agent accumulated too much search history in its own context
- API rate limits prevented continuation

#### 3.2.4 3-Layer Team Hierarchy (Current Approach)

**Method:** Orchestrator → Coordinators → Team Agents → Specialist Sub-Agents.

**Advantages:**
- Context stays clean at each layer (orchestrator sees only summaries, not full search results)
- Multiple search strategies attack each case simultaneously (DIR expert, Legal DB expert, Broad Web expert)
- Crash-resilient (results written to disk after each batch)
- Resumable (orchestrator checks log and skips completed cases)
- Retry logic built-in (up to 3 additional passes on not_found cases)

**Status:** Currently running (launched Feb 13, 2026).

---

## 4. 3-Layer Team Architecture

### 4.1 Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                  ORCHESTRATOR (Layer 1)                     │
│  - Spawns coordinators sequentially                        │
│  - Tracks overall progress                                 │
│  - Manages retry passes                                    │
│  - Context: ~5k per coordinator × 35 = ~175k total         │
└──────────────────────┬─────────────────────────────────────┘
                       │ sequential
                       ▼
┌────────────────────────────────────────────────────────────┐
│                  COORDINATOR (Layer 2)                      │
│  - Handles 15 cases per batch                              │
│  - Spawns 3 team agents in parallel                        │
│  - Collects and writes results to JSONL                    │
│  - Context: ~50k per batch                                 │
└──────────────────────┬─────────────────────────────────────┘
                       │ 3 in parallel
                       ▼
┌────────────────────────────────────────────────────────────┐
│                  TEAM AGENT (Layer 3)                       │
│  - Handles 5 cases                                         │
│  - Spawns 3 specialists per case (in parallel)             │
│  - Merges specialist results (best source wins)            │
│  - Context: ~80k per team                                  │
└──────────────────────┬─────────────────────────────────────┘
                       │ 3 per case
                       ▼
┌────────────────────────────────────────────────────────────┐
│              SPECIALISTS (Layer 3 Sub-Agents)               │
│                                                            │
│  Specialist A — DIR WCAB Expert                            │
│  - DIR Panel Decisions (2021-2025)                         │
│  - En banc decisions                                       │
│  - Significant panel decisions                             │
│                                                            │
│  Specialist B — Legal Database Expert                      │
│  - CourtListener                                           │
│  - Justia                                                  │
│  - Stanford SCOCAL                                         │
│  - Google Scholar                                          │
│                                                            │
│  Specialist C — Broad Web Expert                           │
│  - General web search                                      │
│  - Law firm blogs                                          │
│  - WorkCompCentral, WorkCompAcademy                        │
│  - Archive.org (older cases)                               │
│                                                            │
│  Context: ~30k per specialist (1 case, 3-5 searches)       │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Scale Math

| Metric | Value |
|--------|-------|
| Total Cases | 527 |
| Coordinators (527 ÷ 15) | ~35 |
| Team Agents per Coordinator | 3 |
| Specialists per Team (3 × 5 cases) | 15 |
| **Total Agent Spawns** | **~456** |
| **Max Concurrent Agents** | **14** (1 orchestrator + 1 coordinator + 3 teams + 9 specialists) |
| **Estimated Runtime (first pass)** | **2-2.5 hours** |

### 4.3 Context Budget

| Layer | Window | Usage | Headroom |
|-------|--------|-------|----------|
| Orchestrator | 200k | ~175k (35 coordinator summaries) | Comfortable |
| Coordinator | 200k | ~55k (15 cases + 3 team results) | Very comfortable |
| Team Agent | 200k | ~60k (5 cases + 15 specialist results) | Very comfortable |
| Specialist | 200k | ~27k (1 case + search results) | Very comfortable |

---

## 5. Search Strategies & Data Sources

### 5.1 Specialist A — DIR WCAB Expert

**Focus:** California Department of Industrial Relations (DIR) WCAB decisions — the primary source for ~80% of cases.

**URL Patterns:**
```
Panel Decisions (most common):
https://www.dir.ca.gov/wcab/Panel-Decisions-{YEAR}/{FirstName}-{LASTNAME}-ADJ{number}.pdf

En Banc Decisions:
https://www.dir.ca.gov/WCAB/EnBancdecisions{YEAR}/{YEAR}-EB-{N}.pdf
https://www.dir.ca.gov/wcab/{YEAR}-eb{N}.pdf

Significant Panel Decisions:
https://www.dir.ca.gov/wcab/{YEAR}-spd{N}.pdf

Deceased Applicant:
https://www.dir.ca.gov/wcab/Panel-Decisions-{YEAR}/{FirstName}-{LASTNAME}-ADJ{number}(Decd).pdf
```

**Search Strategy:**
1. Extract party names from case name
2. WebSearch for ADJ number: `"{plaintiff lastname}" ADJ site:dir.ca.gov/wcab`
3. Try panel decision URL pattern for years 2025, 2024, 2023, 2022, 2021
4. Use WebFetch to verify URL returns valid PDF content (not 404)
5. If not found, try en banc and significant panel pages

**Success Rate:** ~80% of findable cases

### 5.2 Specialist B — Legal Database Expert

**Focus:** Established legal databases with California case law.

**Data Sources:**

| Source | URL Pattern | Coverage |
|--------|-------------|----------|
| CourtListener | courtlistener.com | California appellate decisions |
| Justia | law.justia.com | Published opinions (often HTML only) |
| Stanford SCOCAL | scocal.stanford.edu | Supreme Court & Court of Appeal |
| Google Scholar | scholar.google.com | Links to primary sources |
| CA Courts Official | courts.ca.gov/opinions | Official court opinions |

**Search Strategy:**
1. WebSearch each source with case name
2. WebFetch promising pages to extract PDF links
3. Note if only HTML is available (no PDF)
4. For Supreme Court/Court of Appeal cases, prioritize Stanford SCOCAL

**Success Rate:** ~15% (primarily for published appellate opinions)

### 5.3 Specialist C — Broad Web Expert

**Focus:** Alternative sources beyond standard legal databases.

**Data Sources:**
- General web search (case name + "PDF")
- Law firm case analysis blogs
- WorkCompCentral, WorkCompAcademy
- Archive.org (Wayback Machine for older cases)
- State bar and legal aid sites

**Special Responsibilities:**
- Verify if case is actually a workers' compensation case (some mismatches are non-WC cases)
- Search by legal topic (from `problem` field) instead of case name for difficult cases
- Accept HTML sources when PDF is unavailable

**Success Rate:** ~5% (catches edge cases the other specialists miss)

### 5.4 Source Success Rates (Historical Data)

Based on prior runs (108 cases searched):

| Source | Found | Percentage |
|--------|-------|------------|
| dir.ca.gov | 30 | 79% |
| Stanford SCOCAL | 1 | 3% |
| Justia | 1 | 3% |
| courts.ca.gov | 1 | 3% |
| Other (blogs, WorkComp sites) | 2 | 5% |
| HTML-only (no PDF) | 4 | 10% |
| Not found | 25 | — |

---

## 6. Operational Procedures

### 6.1 Starting the Operation

**Prerequisites:**
- `comprehensive-search-status.json` exists with remaining cases
- Backend database is accessible
- Orchestrator agent prompt is prepared

**Launch Command:**
```
Task tool with:
  subagent_type: "general-purpose"
  model: "default"
  run_in_background: true
  description: "Orchestrate 527 case PDF search"
  prompt: [orchestrator prompt from CASE-FINDING-PLAN.md]
```

### 6.2 Progress Monitoring

**Check completion status:**
```bash
cd /home/vncuser/Desktop/Claude_Code/projects/legal-research-backend

# Count completed cases
wc -l agent-search-log.jsonl

# See latest results
tail -20 agent-search-log.jsonl

# Count by status
cat agent-search-log.jsonl | jq -r '.status' | sort | uniq -c
```

**Expected output:**
```
     45 found
     12 not_found
      3 html_only
      2 court_of_appeal
      1 not_wc_case
```

### 6.3 Handling Crashes

The operation is designed to be crash-resilient:

1. **If orchestrator crashes:** Results up to the last completed coordinator batch are saved in `agent-search-log.jsonl`
2. **Resume:** Simply launch a new orchestrator — it reads the log and skips completed cases
3. **No data loss:** The append-only log ensures progress is never lost

**Resume procedure:**
```bash
# Check what's done
cat agent-search-log.jsonl | jq -r '.caseId' | wc -l

# Launch new orchestrator with same prompt
# It automatically skips already-done cases
```

### 6.4 Retry Logic

After the first pass completes, the orchestrator automatically enters retry mode for `not_found` cases:

**Retry Pass 1 — Refined Queries:**
- Drop exact quotes (handle name variations)
- Try alternative name orderings
- Search by ADJ number alone
- Expand year range (2020, 2019, 2018)

**Retry Pass 2 — Topic Search:**
- Search by legal topic from `problem` field instead of case name
- Try Google cache and web archives
- Search for case in citations of other known cases

**Retry Pass 3 — Maximum Creativity:**
- Search using Labor Code sections mentioned in problem
- Try WCJ (judge) name if extractable
- Check WCAB minutes/agendas
- Accept HTML sources (mark as `html_only` instead of `not_found`)

Each retry increments the `attempt` field in the JSONL log. Maximum 4 attempts per case.

### 6.5 Manual Intervention Points

**When to intervene:**
- Orchestrator has been running for >4 hours (may be stuck)
- Error rate is unusually high (>50% not_found in a batch)
- API rate limits are being hit repeatedly

**How to intervene:**
1. Check the orchestrator's output file: `/tmp/claude-1001/-home-vncuser-Desktop/tasks/{agentId}.output`
2. Stop the orchestrator if needed: `TaskStop {agentId}`
3. Review the log for patterns in failures
4. Adjust specialist search strategies if needed
5. Relaunch orchestrator

---

## 7. Monitoring & Progress Tracking

### 7.1 Log File Format

**File:** `agent-search-log.jsonl`
**Format:** One JSON object per line (JSONL)

**Example entries:**
```jsonl
{"caseId":"abc123","caseName":"John Doe v. Acme Corp","status":"found","url":"https://www.dir.ca.gov/wcab/Panel-Decisions-2024/John-DOE-ADJ12345678.pdf","notes":"2024 DIR panel decision","timestamp":"2026-02-13T20:30:00Z","attempt":1}
{"caseId":"def456","caseName":"Jane Smith v. XYZ Inc","status":"not_found","url":"","notes":"Tried DIR, CourtListener, Justia — no PDF available","timestamp":"2026-02-13T20:31:00Z","attempt":1}
{"caseId":"ghi789","caseName":"Case at 61 Cal.4th 291","status":"court_of_appeal","url":"","notes":"Supreme Court case, no free PDF source","timestamp":"2026-02-13T20:32:00Z","attempt":1}
```

### 7.2 Status Values

| Status | Meaning | Follow-Up Action |
|--------|---------|------------------|
| `found` | PDF URL verified accessible | Download and verify, then replace in DB |
| `not_found` | No PDF found after full search | Retry in later passes, or mark as unavailable |
| `html_only` | Case text available as HTML, no PDF | Convert HTML to text, or accept HTML source |
| `court_of_appeal` | Published/unpublished appellate opinion, no free PDF | Requires paid legal database or archive request |
| `not_wc_case` | Case is not a workers' compensation case | Delete from database |
| `corrupted` | PDF exists but is corrupted/unreadable | Try alternative source or manual download |
| `already_downloaded` | PDF already in downloads/agent-found/ | Skip search, already handled |

### 7.3 Real-Time Dashboard Queries

**Overall progress:**
```bash
echo "Total cases searched: $(wc -l < agent-search-log.jsonl)"
echo "Remaining: $((527 - $(wc -l < agent-search-log.jsonl)))"
```

**Success rate:**
```bash
cat agent-search-log.jsonl | jq -r '.status' | sort | uniq -c | awk '
  BEGIN { total=0; found=0 }
  { total += $1; if ($2 == "found") found = $1 }
  END { printf "Success rate: %.1f%% (%d/%d)\n", (found/total)*100, found, total }
'
```

**Cases needing retry:**
```bash
cat agent-search-log.jsonl | jq -r 'select(.status == "not_found" and .attempt < 4) | .caseName' | wc -l
```

**Top 10 recent finds:**
```bash
cat agent-search-log.jsonl | jq -r 'select(.status == "found") | "\(.caseName) -> \(.url)"' | tail -10
```

### 7.4 Metrics to Track

| Metric | Target | Current (as of Feb 13) |
|--------|--------|------------------------|
| Total Cases Processed | 527 | 1 |
| Success Rate (found) | >50% | TBD |
| Not Found Rate | <30% | TBD |
| HTML-Only Rate | <10% | TBD |
| Court of Appeal Rate | <5% | TBD |
| Processing Speed | ~15-20 cases/hour | TBD |
| Total Runtime (first pass) | <3 hours | In progress |

---

## 8. Post-Search Pipeline

After PDFs are found, they flow through a verification and replacement pipeline:

### 8.1 PDF Download

For each case with `status: "found"`:

```bash
# Download to staging directory
wget -O "downloads/agent-found/{caseName}.pdf" "{url}"

# Verify file size (>10 KB)
if [ $(stat -f%z "downloads/agent-found/{caseName}.pdf") -lt 10240 ]; then
  echo "ERROR: PDF too small, likely 404 page"
fi
```

### 8.2 PDF Verification

**Script:** `scripts/lib/pdf-verifier.ts`

**Verification Steps:**
1. **Name Matching:** Fuzzy match between case name and PDF text (Levenshtein distance)
2. **Citation Matching:** If citation is available, verify it appears in PDF
3. **Key Points Matching:** Check if legal issues from `problem` field are discussed in PDF
4. **Confidence Threshold:** Must score >70% to pass

**Output:**
```json
{
  "verified": true,
  "confidence": 85,
  "nameMatch": 90,
  "citationMatch": 80,
  "keyPointsMatch": 75,
  "notes": "All verifications passed"
}
```

### 8.3 Case Replacement

**Script:** `scripts/lib/case-replacer.ts`

For verified PDFs:

1. **Backup old case:** Export old case data to JSON (in case of rollback)
2. **Delete wrong case:** Remove from `LegalCase` table (cascades to related tables)
3. **Create new case:** Insert new record with correct PDF
4. **Queue for re-extraction:** Add to BullMQ job queue for IRAC extraction
5. **Log replacement:** Record in `CaseReplacementLog` table

**Database transaction:**
```sql
BEGIN;

-- Backup
INSERT INTO case_replacement_log (old_case_id, new_case_id, reason, old_data)
VALUES ('old-uuid', 'new-uuid', 'Complete mismatch - wrong PDF', '{...}');

-- Delete old
DELETE FROM legal_case WHERE id = 'old-uuid';

-- Insert new
INSERT INTO legal_case (id, case_name, official_citation, pdf_url, ...)
VALUES ('new-uuid', 'Correct Name', '123 Cal.4th 456', 'https://...', ...);

-- Queue for extraction
INSERT INTO job_queue (job_type, data)
VALUES ('extract-irac', '{"caseId": "new-uuid"}');

COMMIT;
```

### 8.4 IRAC Re-Extraction

**Process:**
1. Download PDF from verified URL
2. Run OCR extraction (if needed)
3. Send to Gemini for AI analysis
4. Each AI extracts IRAC independently
5. Merge results using consensus (median scoring)
6. Update database with new IRAC brief
7. Generate embeddings for semantic search
8. Mark case as complete

**Quality checks:**
- IRAC completeness (all 4 sections present)
- Confidence score from AI consensus
- External validation against known sources

---

## 9. Known Issues & Resolutions

### 9.1 Citation-Only Cases

**Issue:** 33 cases in the database have only a citation, not party names (e.g., "Case at 61 Cal.4th 291").

**Challenge:** Can't search DIR by party name — need to identify the case first.

**Resolution:**
1. Specialist B searches the citation on legal databases to identify the actual case name
2. Once identified, Specialist A can search DIR with the real party names
3. If it's a Supreme Court or Court of Appeal case, it may only be on Stanford SCOCAL

**Example:**
```
Database: "Case at 61 Cal.4th 291"
Specialist B finds: Hikida v. Workers' Comp. Appeals Bd.
Specialist A searches: "Hikida" site:dir.ca.gov/wcab
Result: Not on DIR (Supreme Court case), found on Stanford SCOCAL
```

### 9.2 Unpublished Court of Appeal Cases

**Issue:** Some cases are unpublished Court of Appeal opinions not available on free sources.

**Indicators:**
- Case number like "B273010" or "A154287" (Court of Appeal case numbers)
- `notes` field says "unpublished" or "not citable"

**Resolution:**
- Mark as `status: "court_of_appeal"`
- Options:
  1. Request from court archives (manual process, 2-4 weeks)
  2. Access via paid legal database (Westlaw, LexisNexis)
  3. Contact attorneys involved in the case for a copy
  4. Mark as unavailable in database

**Count:** ~15 cases expected to fall into this category

### 9.3 Non-WC Cases in Database

**Issue:** Some cases in the database are not actually workers' compensation cases (data entry errors).

**Example:** "California Campaign Committee v. Brown" — this is an election law case, not WC.

**Resolution:**
- Specialist C identifies these during search (mismatch between case topic and WC law)
- Mark as `status: "not_wc_case"`
- Delete from database entirely
- Log deletion in audit trail

**Count:** ~5-10 cases expected

### 9.4 Name Variations

**Issue:** Same case appears under different name variations.

**Examples:**
- "John Doe" vs. "Johnny Doe" vs. "J. Doe"
- "ACME Corporation" vs. "Acme Corp" vs. "ACME CORP."
- Deceased applicants: "John Doe (deceased)" vs. "John Doe (Decd)" vs. "Estate of John Doe"

**Resolution:**
- Team agent merges results from all 3 specialists
- If multiple specialists find different URLs for what appears to be the same case, verify they're actually the same case
- Use fuzzy name matching (Levenshtein distance) to detect variations
- Prefer the URL with the most complete name

### 9.5 Broken External Links

**Issue:** External validation URLs from the quality audit sometimes return 403 Forbidden or 404 Not Found.

**Causes:**
- Anti-bot protection (Justia frequently blocks automated requests)
- Links changed or moved
- Paid content that was previously free

**Resolution:**
- Don't rely solely on external validation URLs
- Use WebSearch to find alternative sources
- For 403 errors, try accessing via web browser (manual check) or use Archive.org

### 9.6 Multiple ADJ Numbers

**Issue:** Some cases have multiple ADJ numbers (consolidated cases).

**Example:** `Martina-VARELAS-ADJ13021836-ADJ13022571-ADJ17282642-ADJ20509785-ADJ20509813.pdf`

**Resolution:**
- DIR URL pattern handles this: `{Name}-ADJ{num1}-ADJ{num2}-ADJ{num3}.pdf`
- Specialist A tries each ADJ number individually first, then combinations
- WebSearch may reveal which ADJ numbers are relevant

---

## 10. Future Improvements

### 10.1 Automated PDF Verification

**Current:** Manual review of downloaded PDFs for content match.

**Future:** Automated verification using AI:
1. Download PDF
2. Extract first page with OCR
3. Use AI to summarize what the case is about
4. Compare AI summary with expected topic from `problem` field
5. Auto-approve if confidence >85%, flag for human review if 70-85%, reject if <70%

**Benefit:** Reduce human review time by ~80%

### 10.2 Court Archive API Integration

**Current:** Unpublished Court of Appeal cases require manual requests.

**Future:** Integrate with California Courts API (if/when available) to programmatically request opinions.

**Benefit:** Eliminate the ~15 cases that currently can't be found on free sources

### 10.3 Caching Specialist Results

**Current:** Each retry pass searches from scratch.

**Future:** Cache search results from specialists:
- If Specialist A already tried a case and found nothing, don't re-try DIR in retry pass 1
- Only retry with the new/expanded strategy (different years, different queries)

**Benefit:** ~30% faster retry passes

### 10.4 Learning from Successes

**Current:** Each specialist uses fixed search strategies.

**Future:** Track which strategies work best for which case types:
- Citation-only cases → 90% success with Stanford SCOCAL (prioritize Specialist B)
- Standard party names → 85% success with DIR (prioritize Specialist A)
- En banc decisions → Always try en banc page first

**Implementation:** Maintain a success matrix and adjust specialist priority based on case characteristics.

**Benefit:** ~15% higher success rate by using optimal specialist for each case type

### 10.5 HTML-to-PDF Conversion

**Current:** Cases with `html_only` status are marked as incomplete.

**Future:** Automatically convert HTML sources to PDF:
1. Fetch HTML from Justia/Stanford
2. Clean HTML (remove ads, navigation)
3. Convert to PDF using Playwright/Puppeteer
4. Store converted PDF in database

**Benefit:** Recover ~4% of cases currently marked as html_only

### 10.6 User-Contributed PDFs

**Current:** All PDFs sourced automatically from public websites.

**Future:** Allow users (attorneys) to upload PDFs for cases marked as `not_found`:
1. User uploads PDF via dashboard
2. AI verifies it matches the expected case
3. If verified, replace in database
4. Credit the contributing user

**Benefit:** Crowdsource hard-to-find cases, especially older/unpublished opinions

---

## Appendix A: File Locations

### A.1 Knowledge Base Backend

**Repository:** `Glass-Box-Solutions-Inc/wc-knowledge-base` (private)
**Local Path:** `/home/vncuser/Desktop/knowledge-base/`
**Production:** `https://legal-research-backend-378330630438.us-central1.run.app`

### A.2 Case Finding Scripts

**Repository:** `Glass-Box-Solutions-Inc/Sandbox` (private)
**Local Path:** `/home/vncuser/Desktop/Claude_Code/projects/legal-research-backend/`

**Key Files:**
```
legal-research-backend/
├── CASE-FINDING-PLAN.md               # Master plan (this document's source)
├── DISAGREEMENT_SEVERITY.json         # 635 mismatch cases
├── comprehensive-search-status.json   # Remaining cases after dedup
├── agent-search-log.jsonl             # Progress log (single source of truth)
├── agent-results-batch{1,2,3}.json    # Historical batch results
├── recovered-agent-results.json       # Results from crashed sessions
├── downloads/agent-found/             # Downloaded PDFs (58 files)
├── scripts/
│   ├── agent-find-cases.ts            # Generate agent prompts (legacy)
│   ├── replace-mismatch-cases.ts      # Post-search pipeline orchestrator
│   └── lib/
│       ├── correct-case-finder.ts     # Static finder (deprecated)
│       ├── pdf-verifier.ts            # Verify PDFs match expected case
│       └── case-replacer.ts           # DB replacement logic
```

### A.3 Documentation

**Repository:** `Glass-Box-Solutions-Inc/adjudica-documentation` (private)
**This File:** `product/technical/KNOWLEDGE_BASE_OPERATIONS.md`

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **IRAC** | Issue, Rule, Application, Conclusion — a legal analysis framework |
| **WCAB** | Workers' Compensation Appeals Board (California) |
| **DIR** | Department of Industrial Relations (California) |
| **ADJ Number** | Adjudication number — unique identifier for WCAB cases |
| **En Banc** | Decision by all judges of the WCAB, not just a panel |
| **Significant Panel Decision** | Panel decision designated as precedential |
| **Court of Appeal** | California's intermediate appellate court |
| **Supreme Court** | California's highest court |
| **SCOCAL** | Supreme Court of California Opinions Archive (Stanford) |
| **Complete Mismatch** | Case where extracted IRAC describes an entirely different case than identified in database |
| **Orchestrator** | Top-level agent managing the entire case-finding operation |
| **Coordinator** | Mid-level agent handling 15 cases and spawning team agents |
| **Team Agent** | Low-level agent handling 5 cases and spawning specialists |
| **Specialist** | Sub-agent with expertise in one type of search (DIR, Legal DB, or Broad Web) |

---

## Appendix C: Contact & Support

**Technical Owner:** Glass Box Solutions, Inc.
**System Administrator:** Alexander D. Brewsaugh, Esq. (Alex@Adjudica.ai)
**Documentation Maintainer:** Glass Box Solutions, Inc.

**For Issues:**
1. Check the progress log: `agent-search-log.jsonl`
2. Review recent orchestrator output
3. Consult this documentation
4. Contact system administrator if unresolved

**For Updates:**
- This document is version-controlled in the `adjudica-documentation` repository
- Last major update: February 13, 2026
- Next planned review: After operation completes (est. Feb 14, 2026)

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
