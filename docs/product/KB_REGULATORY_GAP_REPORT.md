# Knowledge Base Regulatory Content Gap Report

**Purpose:** Identifies statutory/regulatory sources needed for WC Defense Attorney and Claims Examiner foundational documents that are missing from the Knowledge Base
**Generated:** 2026-03-21
**KB Repository:** `/home/vncuser/Desktop/knowledge-base/`
**Database:** PostgreSQL via Prisma ORM
**Queried Against:** `regulatory_sections` table (1,580 records) and `legal_principles` table (17,353 records)

---

## Database Inventory Summary

| Source Type | Record Count | Coverage |
|-------------|-------------|----------|
| `labor_code` | 401 | LC 3200-3865, LC 4451-6208 |
| `ccr_title_8` | 409 | DWC/WCAB/UR regulations |
| `ama_guides_5th` | 584 | AMA Guides 5th Edition |
| `pdrs_2005` | 59 | Permanent Disability Rating Schedule |
| `mtus` | 41 | Medical Treatment Utilization Schedule |
| `omfs` | 86 | Official Medical Fee Schedule |
| **TOTAL** | **1,580** | |

### Source Types That DO NOT EXIST in the KB

| Missing Source Type | Domain | Impact |
|--------------------|--------|--------|
| `crpc` | California Rules of Professional Conduct | Attorney professional duties |
| `business_professions` | Business & Professions Code | UPL prohibition, attorney duties |
| `insurance_code` | California Insurance Code | Claims examiner statutory duties |
| `ccr_title_10` | CCR Title 10 (Dept. of Insurance) | Fair Claims Settlement Practices |
| `naic` | NAIC Model Acts | Interstate regulatory framework |

---

## PART 1: SOURCES CONFIRMED PRESENT IN KB

These sections were queried directly from the `regulatory_sections` table and contain full statutory text.

### Labor Code — Present

| Section | Title | Text Length | Notes |
|---------|-------|-------------|-------|
| **LC 3761** | Insurer notification to employer | 2,754 chars | Full text confirmed |
| **LC 3762** | Claims file discussion with employer | 1,561 chars | Full text confirmed |
| **LC 4600** | Medical treatment obligation | 8,210 chars | Full text confirmed |
| **LC 4600.1-4600.6** | Generic drugs, pharmacy, HCO, capitation | 6 records | Full text confirmed |
| **LC 4601-4603.2** | Change of physician, competency, billing | 4 records | Full text confirmed |
| **LC 4610** | Utilization Review | 23,903 chars | Comprehensive — full text confirmed |
| **LC 4650** | TD first payment timing (14 days) | 5,147 chars | Full text confirmed |
| **LC 4650.5-4657** | TD payment provisions (all) | 7 records | Full text confirmed |
| **LC 4660** | PD rating (pre-2013 injuries) | 2,877 chars | Full text confirmed |
| **LC 4663** | Apportionment based on causation | 1,805 chars | Full text confirmed |
| **LC 4664** | Employer liability for PD | 1,479 chars | Full text confirmed |
| **LC 4903** | Liens against compensation | 3,950 chars | Full text confirmed |
| **LC 4903.1** | Lien determination before award | 5,363 chars | Full text confirmed |
| **LC 4906** | Attorney fee charges and agreements | 6,037 chars | Full text confirmed |
| **LC 5500** | WCAB pleading requirements | 1,064 chars | Full text confirmed |
| **LC 5500.5** | Cumulative injury liability | 13,108 chars | Full text confirmed |

### CCR Title 8 — Present

| Section | Title | Text Length | Notes |
|---------|-------|-------------|-------|
| **CCR 10100** | Definitions (pre-1994) | 6,427 chars | Claims administration definitions |
| **CCR 10101** | Claim File Contents | 2,784 chars | Full text confirmed |
| **CCR 10102** | Retention of Claim Files | 1,893 chars | Full text confirmed |
| **CCR 10103** | Claim Log Contents and Maintenance | 2,430 chars | Full text confirmed |
| **CCR 10104** | Annual Report of Inventory | 5,354 chars | Full text confirmed |
| **CCR 10105** | Auditing Discretion | 1,650 chars | Full text confirmed |
| **CCR 10106** | Random/Non-Random Audit Selection | 12,400 chars | Full text confirmed |
| **CCR 10107** | Notice of Audit; Claim File Selection | 11,525 chars | Full text confirmed |
| **CCR 10108** | Audit Violations General Rules | 9,608 chars | Full text confirmed |
| **CCR 10109** | Duty to Investigate; Good Faith | 3,045 chars | **KEY EXAMINER DUTY — full text confirmed** |
| **CCR 10110-10118** | Penalties, appeals, offer of work | 10 records | Full text confirmed |
| **CCR 10500-10593** | WCAB Rules of Practice & Procedure | 37 records | Pleadings, service, hearing, consolidation — full |
| **CCR 9792.6-9792.12** | Utilization Review Standards | 75 records total | Comprehensive UR regs — full text confirmed |

---

## PART 2: SOURCES CONFIRMED MISSING FROM KB

### GAP 1: California Rules of Professional Conduct (CRPC)

**Impact:** Attorney document Part 1 — professional duties to client, court, and profession

| Section | Title | Why Needed |
|---------|-------|-----------|
| **CRPC 1.1** | Competence (including technology duty) | Attorney obligation to understand AI capabilities/limitations |
| **CRPC 1.4** | Communication with Clients | AI disclosure obligations to clients |
| **CRPC 1.5** | Fees (unconscionability standard) | Billing ethics with AI — cannot bill phantom hours |
| **CRPC 1.6** | Confidentiality | Strictest in nation; governs client data input to AI systems |
| **CRPC 3.1** | Meritorious Claims and Contentions | Cannot assert frivolous positions — applies to AI-generated arguments |
| **CRPC 3.3** | Candor Toward the Tribunal | Duty not to present false evidence — applies to AI-generated citations |
| **CRPC 3.4** | Fairness to Opposing Party and Counsel | Discovery obligations, document integrity |
| **CRPC 5.3** | Supervision of Nonlawyer Assistants | AI treated as nonlawyer assistant per Nov 2023 Guidance |

**Source URL:** https://www.calbar.ca.gov/Attorneys/Conduct-Discipline/Rules/Rules-of-Professional-Conduct/Current-Rules
**Suggested `source_type`:** `crpc`
**Ingestion approach:** Fetch from calbar.ca.gov; each rule is a separate page with rule text + comments

**Note:** Rules 1.1, 1.4, 1.5, 1.6, and 5.3 are already analyzed in `adjudica-documentation/legal/compliance/regulations/CA_BAR_ETHICS.md` but that analysis lives in the documentation repo, NOT in the KB database. Rules 3.1, 3.3, and 3.4 have no analysis anywhere.

---

### GAP 2: Business & Professions Code

**Impact:** UPL prohibition (both documents); full enumeration of attorney duties (attorney document)

| Section | Title | Why Needed |
|---------|-------|-----------|
| **B&P 6068** | Duties of Attorney (13 subdivisions) | Complete catalog of attorney obligations — foundation for attorney-in-the-loop model |
| **B&P 6068(a)** | Support Constitution and laws | |
| **B&P 6068(b)** | Maintain respect due to courts | |
| **B&P 6068(c)** | Counsel or maintain only legal actions | |
| **B&P 6068(d)** | Employ means consistent with truth | |
| **B&P 6068(e)(1)** | Maintain inviolate client confidences | Already referenced in KB case law, but no regulatory_sections record |
| **B&P 6068(f)** | Advance no fact prejudicial to client | |
| **B&P 6068(g)** | Not encourage suit or delay for personal gain | |
| **B&P 6068(h)** | Never reject cause of defenseless/oppressed | |
| **B&P 6068(i)** | Cooperate with disciplinary investigations | |
| **B&P 6068(j)** | Comply with conditions of probation | |
| **B&P 6068(k)** | Comply with court sanctions | |
| **B&P 6068(l)** | Report sanctions to State Bar | |
| **B&P 6068(m)** | Inform clients of significant developments | |
| **B&P 6125** | Practice of law by unlicensed person prohibited | Core UPL statute — referenced in legal_principles but no regulatory_sections record |
| **B&P 6126** | Practice of law by unlicensed person — penalties | Criminal penalties for UPL |
| **B&P 6127** | Contempt for unauthorized practice | |

**Source URL:** https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=BPC&division=3.&title=&part=&chapter=4.&article=
**Suggested `source_type`:** `business_professions`
**Ingestion approach:** Fetch from leginfo.legislature.ca.gov; same pattern as existing `ingest-labor-code.js`

---

### GAP 3: California Insurance Code — Unfair Claims Settlement Practices

**Impact:** Examiner document Part 1 — the single most important statutory source for claims examiner duties

| Section | Title | Why Needed |
|---------|-------|-----------|
| **Ins. Code 790.03(h)** | Unfair Claims Settlement Practices Act | Lists 16+ specific prohibited practices for insurers — THIS IS THE CORE STATUTORY AUTHORITY for claims examiner conduct |
| **Ins. Code 790.03(h)(1)** | Misrepresenting pertinent facts/provisions | |
| **Ins. Code 790.03(h)(2)** | Failing to acknowledge/act reasonably on communications | |
| **Ins. Code 790.03(h)(3)** | Failing to adopt reasonable standards for prompt investigation | |
| **Ins. Code 790.03(h)(4)** | Refusing to pay claims without reasonable investigation | |
| **Ins. Code 790.03(h)(5)** | Failing to affirm or deny coverage within reasonable time | |
| **Ins. Code 790.03(h)(6)** | Not attempting good faith fair settlement when liability clear | |
| **Ins. Code 790.03(h)(7)** | Compelling litigation by unreasonable offers | |
| **Ins. Code 790.03(h)(8)** | Attempting to settle for less than reasonable person would believe entitled | |
| **Ins. Code 790.03(h)(9)** | Attempting to settle on altered application without consent | |
| **Ins. Code 790.03(h)(10)** | Making claims payments without explanation | |
| **Ins. Code 790.03(h)(11)** | Unreasonable delay in claims handling | |
| **Ins. Code 790.03(h)(12)** | Requiring preliminary claim report as condition of settlement | |
| **Ins. Code 790.03(h)(13)** | Failing to settle under one coverage to influence another | |
| **Ins. Code 790.03(h)(14)** | Failing to provide reasonable explanation of denial | |
| **Ins. Code 790.03(h)(15)** | Unreasonably threatening cancellation or nonrenewal | |
| **Ins. Code 790.03(h)(16)** | Failing to include surcharge information | |
| **Ins. Code 790.06** | Penalties and enforcement | |

**Source URL:** https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=790.03.&lawCode=INS
**Suggested `source_type`:** `insurance_code`
**Ingestion approach:** New script `ingest-insurance-code.js` following pattern of `ingest-labor-code.js`

---

### GAP 4: CCR Title 10 — Fair Claims Settlement Practices Regulations (Dept. of Insurance)

**Impact:** Examiner document Part 1 — implementing regulations for Insurance Code 790.03; contains specific timelines

| Section | Title | Why Needed |
|---------|-------|-----------|
| **10 CCR 2695.1** | Preamble | Scope and purpose |
| **10 CCR 2695.2** | Definitions | Key terms for claims handling |
| **10 CCR 2695.3** | File and Record Documentation | Claims file requirements |
| **10 CCR 2695.4** | Representation of Policy Provisions | Accuracy requirements |
| **10 CCR 2695.5** | Duties Upon Receipt of Communication | **15 business days to acknowledge; 40 calendar days to accept/deny** |
| **10 CCR 2695.6** | Training and Certification | Adjuster qualification requirements |
| **10 CCR 2695.7** | Standards for Prompt Investigation | Investigation timeline and standards |
| **10 CCR 2695.8** | Additional Standards — Automobile Insurance | |
| **10 CCR 2695.9** | Additional Standards — Workers' Compensation | **WC-specific claims handling standards** |
| **10 CCR 2695.10** | Additional Standards — Property Insurance | |
| **10 CCR 2695.11** | Severability | |
| **10 CCR 2695.12** | Effective Date | |

**Source URL:** https://www.insurance.ca.gov/0250-insurers/0500-legal-info/0200-regulations/fair-claims-settlement-702.cfm
**Suggested `source_type`:** `ccr_title_10`
**Ingestion approach:** New script `ingest-ccr-title10.js` — note this is from insurance.ca.gov, NOT dir.ca.gov like Title 8

---

### GAP 5: Labor Code Coverage Gaps

**Impact:** Both documents — QME/AME dispute resolution process and DWC notice requirements

| Section | Title | Why Missing | Why Needed |
|---------|-------|-------------|-----------|
| **LC 138.4** | Electronic adjudication management system | Below LC 3200 (Division 1) — current ingest starts at Division 4 (3200+) | DWC electronic filing and notice requirements |
| **LC 4060** | QME evaluation — unrepresented employees | In the 3866-4450 gap | QME process is central to both attorney and examiner practice |
| **LC 4061** | QME evaluation — represented employees, no AME | In the 3866-4450 gap | Triggers when parties cannot agree on AME |
| **LC 4062** | AME selection — represented employees | In the 3866-4450 gap | AME selection process is a critical examiner/attorney duty |
| **LC 4062.1** | (if exists) AME panel process | In the 3866-4450 gap | |
| **LC 4062.2** | AME selection procedures | In the 3866-4450 gap | Referenced in KB UAT output but no regulatory_sections record |

**Root Cause:** The `ingest-labor-code.js` script covers Division 4 Part 2 (LC 4451+) but skips Part 1 Chapter 2.5 (LC 4060-4062) which falls in the article structure gap.

**Fix:** Add LC 4060-4062.2 sections to the ingest script's CHAPTERS array, or add them as individual section fetches.

**Additionally:** LC 138.4 is in Division 1, which is entirely outside the current ingest scope. This would require extending the ingest to cover selected Division 1 sections.

---

### GAP 6: NAIC Model Unfair Claims Settlement Practices Act

**Impact:** Examiner document Part 1.5 — interstate regulatory framework

| Content | Why Needed |
|---------|-----------|
| NAIC Model Unfair Claims Settlement Practices Act | California Insurance Code 790.03 is based on this model act; 24+ states have adopted NAIC-aligned frameworks requiring human-in-the-loop for claims decisions |

**Note:** This is a model code, not California statute. Lower priority than the California-specific gaps above. The existing `INSURANCE_INDUSTRY_STRATEGY.md` in the documentation repo already summarizes the key NAIC provisions and state adoptions. Consider whether full ingestion is needed vs. cross-reference to the documentation repo.

---

## PART 3: LEGAL PRINCIPLES WITH REGULATORY CROSS-REFERENCES (Already in KB)

The `legal_principles` table contains 17,353 principles. Some reference statutes in the gap areas, extracted from case law:

| Principle Category | Count | Relevant to Gaps |
|-------------------|-------|-----------------|
| Principles referencing B&P 6125/6126 | ~3 | UPL prohibition — extracted from case holdings, not statute text |
| Principles referencing "claims adjuster" | ~5 | Adjuster authority and discovery status |
| Principles referencing 10 CCR 2695 | ~2 | Fair claims practices — referenced in case context |
| Principles referencing LC 4060-4062 | ~15+ | QME/AME process — substantial case law but no underlying statute text |

**Implication:** The KB has case law ABOUT these statutes but not the statutes themselves. Ingesting the statutory text would allow the KB to ground case-law principles in their statutory authority.

---

## PART 4: RECOMMENDED INGESTION PRIORITY

| Priority | Gap | Records to Add | Effort | Impact |
|----------|-----|----------------|--------|--------|
| **1 (Critical)** | LC 4060-4062.2 (QME/AME) | ~5 sections | Low — extend existing `ingest-labor-code.js` | Fills the biggest Labor Code gap; central to both products |
| **2 (Critical)** | Insurance Code 790.03 (Unfair Claims Practices) | ~20 sections | Medium — new `ingest-insurance-code.js` script | Core statutory authority for AdjudiCLAIMS |
| **3 (High)** | CCR Title 10 §§ 2695.1-2695.12 | ~12 sections | Medium — new `ingest-ccr-title10.js` script | Implementing regulations with specific timelines |
| **4 (High)** | B&P Code 6068, 6125-6127 | ~16 sections | Medium — new `ingest-bp-code.js` script | Attorney duties and UPL prohibition |
| **5 (Medium)** | CRPC Rules 1.1, 1.4, 1.5, 1.6, 3.1, 3.3, 3.4, 5.3 | ~8 rules + comments | Medium — new `ingest-crpc.js` script (from calbar.ca.gov) | Attorney professional conduct; already analyzed in docs repo |
| **6 (Medium)** | LC 138.4 (DWC notices) | ~1 section | Low — extend ingest to Division 1 | Notice requirement compliance |
| **7 (Low)** | NAIC Model Act | ~20 sections | Low — may not need full ingestion | Interstate framework; can cross-reference docs repo |

---

## PART 5: WHAT THIS MEANS FOR THE FOUNDATIONAL DOCUMENTS

For the immediate task of writing `WC_DEFENSE_ATTORNEY_ROLES_AND_DUTIES.md` and `WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md`:

**Can proceed now with KB content:**
- All Labor Code Part 2 citations (LC 4600+, 4650+, 4660+, 4903+, 5500+)
- All CCR Title 8 claims administration (10100-10118)
- All CCR Title 8 WCAB Rules (10500-10593)
- All CCR Title 8 UR regulations (9792.6+)
- LC 3761-3762 (medical information disclosure)

**Cannot proceed until KB is updated (or must cite from external sources):**
- LC 4060-4062 (QME/AME process) — the 3866-4450 gap
- Insurance Code 790.03(h) — no Insurance Code in KB
- CCR Title 10 fair claims regulations — no Title 10 in KB
- CRPC rules — no professional conduct in KB
- B&P Code 6068, 6125-6126 — no B&P Code in KB

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
