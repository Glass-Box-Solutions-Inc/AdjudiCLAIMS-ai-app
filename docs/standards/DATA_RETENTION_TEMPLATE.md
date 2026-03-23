# Data Retention and Destruction Policy Template

**Audience:** T3 (IT/Compliance Officer), T1 (Attorney Evaluator)
**Implementation Status:** Implemented
**Last Updated:** 2026-02-22
**Version:** 1.0

---

## Purpose

This template provides the standard data retention and destruction policy structure for all Glass Box WC products. Copy this template into your product's compliance documentation and populate all bracketed fields with product-specific values before publication.

No data retention period may be published without stating its legal basis. This requirement is enforced by Quality Gate 6 in WC_DOCUMENTATION_STANDARDS.md.

---

## Section 1: Legal Basis for Retention Periods

All retention periods in Glass Box WC products are governed by the following statutes and regulations. Product-specific policies must not set retention periods shorter than the applicable statutory minimum.

### California Workers' Compensation Records — CA Labor Code §5955

California Labor Code §5955 requires that all records relating to a Workers' Compensation claim be retained for a period of **seven (7) years** from the date of the last entry in the record. This applies to:
- Medical records and treatment documentation
- Legal correspondence and court filings
- PD rating calculations and apportionment determinations
- Indemnity payment records
- Any document generated in connection with a WC matter

**Implication for Glass Box products:** Any document, record, or data element associated with a WC matter must be retained for a minimum of 7 years from the date of the last update to that matter.

### HIPAA PHI Records — 45 CFR §164.530(j)

HIPAA requires covered entities and their business associates to retain documentation of their HIPAA policies and procedures, and records required by the Privacy Rule, for a minimum of **six (6) years** from the date of creation or the date it was last in effect, whichever is later. This applies to:
- PHI access logs
- Breach notifications and documentation
- BAA records
- HIPAA training records
- Incident response records

**Implication for Glass Box products:** PHI audit logs, breach records, and HIPAA compliance documentation must be retained for a minimum of 6 years. Where both CA Labor Code §5955 and HIPAA apply, the longer period (7 years) governs.

### Conflict Resolution

When multiple retention requirements apply to the same data element, the longer retention period governs. The table in Section 2 identifies the controlling statute for each data category.

---

## Section 2: Retention Schedule

Populate this table for your product. Every row must have a Legal Basis column entry citing a specific statute, regulation, or contractual term. Delete rows for data categories your product does not process. Add rows for any additional data categories.

| Data Category | Retention Period | Legal Basis | Deletion Method | Verification |
|--------------|-----------------|-------------|----------------|-------------|
| WC matter documents (medical records, legal filings, reports) | 7 years from date of last update to the matter | CA Labor Code §5955 | Secure overwrite (NIST 800-88 or equivalent) + certificate of destruction | Deletion log with matter ID, record count, destruction date, method |
| PHI audit logs (access, processing, disclosure events) | 7 years from creation | CA Labor Code §5955 (controlling over HIPAA §164.530(j) 6-year minimum) | Secure deletion from primary storage; backup deletion per backup schedule | Audit system deletion confirmation log |
| HIPAA compliance records (BAAs, training records, breach notifications) | 6 years from creation or last effective date | HIPAA 45 CFR §164.530(j) | Secure deletion | Deletion log with document type, creation date, deletion date |
| Incident response records | 6 years | HIPAA 45 CFR §164.530(j); Incident Response Policy | Secure deletion | Deletion log |
| User account data (name, email, role, firm affiliation) | Duration of active account + 2 years post-termination | Contractual — Data Processing Agreement | Secure deletion of account record; PHI access logs retained per PHI log schedule above | Account closure confirmation; deletion log |
| Authentication and session logs | 90 days | Operational — intrusion detection, access review | Automatic log rotation | System log confirming rotation |
| System performance logs (no PHI) | 90 days | Operational | Automatic log rotation | System log confirming rotation |
| Error logs (no PHI by configuration) | 90 days | Operational | Automatic log rotation | System log confirming rotation |
| Billing and payment records | 7 years | IRS Revenue Ruling 98-25; contractual | Secure deletion | Deletion log |
| [Product-specific data category] | [Period] | [Statute or contract section] | [Method] | [Verification] |

**Instruction for "Deletion Method":** Acceptable methods for PHI destruction include NIST SP 800-88 compliant overwriting for digital media, cryptographic erasure for encrypted data (erasure of encryption keys makes data permanently inaccessible), or verified secure deletion through a sub-processor under BAA. "Manual deletion from the UI" is not an acceptable PHI destruction method.

---

## Section 3: PHI Destruction Procedure

### When PHI Destruction Is Triggered

PHI is destroyed according to the retention schedule above. Destruction is triggered by:
- Expiration of the applicable retention period
- Attorney firm account closure (matter records destroyed after the applicable statutory period from last activity, not from account closure date)
- Written request from the attorney firm that is consistent with applicable retention requirements (see Section 6 on CCPA conflicts)
- Court order

### Destruction Method for Digital PHI

**Primary storage (database and file storage):**
1. PHI is cryptographically overwritten or the encryption key is destroyed (cryptographic erasure), rendering data permanently inaccessible
2. The destruction event is logged: record identifier, data category, destruction timestamp, method used, and the identity of the system or user that initiated destruction
3. A certificate of destruction is generated and retained for [6 years / 7 years — use the longer applicable period] as proof of compliance

**Backups:**
PHI in backup storage is subject to the same retention schedule as primary storage. Backups are not retained beyond the applicable retention period. See Section 4 for backup-specific procedures.

**AI sub-processor data:**
AI sub-processors (Anthropic, OpenAI, Google Vertex AI) do not retain prompt or response data beyond the API request. No separate destruction action is required for data processed by AI sub-processors. This is documented in the executed BAAs and is verified annually by the Glass Box compliance team.

### Certificate of Destruction

Upon destruction of PHI, Glass Box generates a Certificate of Destruction containing:
- Date and time of destruction
- Description of data destroyed (data category, matter ID range or account ID, volume)
- Method of destruction
- Identity of system or personnel responsible
- Confirmation that destruction is complete and verified

Certificates of Destruction are available to attorney firms upon request at compliance@adjudica.ai. Certificates are retained for 6 years.

---

## Section 4: Backup vs. Production Data Retention

**The same retention schedule applies to backup data as to production data.** A backup is not a separate data category with a different retention period. Retaining PHI in backup storage beyond the applicable retention period is a HIPAA violation.

### Backup Retention Policy

| Backup Type | Backup Frequency | Backup Retention | Applies Statutory Retention? |
|------------|-----------------|-----------------|------------------------------|
| Daily incremental backup | Daily | 30 days | Yes — PHI in daily backups is subject to the same 7-year retention from last matter activity; backups are rotated after 30 days with PHI destruction per Section 3 |
| Weekly full backup | Weekly | 90 days | Yes — same rule applies |
| Long-term archive | Per retention schedule | Per data category retention period | Yes — archive is destroyed when the matter's statutory retention period expires |

### Backup Destruction on Retention Expiry

When a matter's statutory retention period expires:
1. All primary storage records for that matter are destroyed per Section 3
2. The Glass Box operations team verifies that the matter's data is excluded from all active backup sets
3. If data remains in a backup set that cannot be selectively deleted (because the backup medium is not segmented by matter), the entire backup set is flagged for destruction when it would otherwise rotate, and a hold is placed on that backup set to ensure it is not used for restore operations

---

## Section 5: Matter-Closure Data Handling

When an attorney firm closes a matter within the product:

1. **Matter data is not immediately destroyed.** The matter is marked as closed, and the retention clock for the 7-year statutory period continues from the date of the last activity, not the date of matter closure.

2. **Closed matter access:** Closed matters remain accessible to authorized firm users in read-only mode for the statutory retention period.

3. **Matter data export before closure:** Before closing a matter, firms may export all matter data in [describe available formats, e.g., PDF, JSON, ZIP of original documents]. The export is the firm's copy and is the firm's responsibility to retain.

4. **Destruction at retention expiry:** When the statutory retention period expires for a closed matter, Glass Box will notify the firm 90 days before destruction and destroy the matter data per Section 3 unless the firm provides a legal hold notice.

5. **Account closure before matter retention expiry:** If a firm closes its account before matter retention periods expire, Glass Box will:
   a. Provide the firm with a complete data export
   b. Retain the matter data in isolated storage until the statutory period expires
   c. Destroy the data at retention expiry per Section 3
   d. Provide the firm with the Certificate of Destruction

---

## Section 6: Right-to-Erasure Conflict With Retention Requirements

### CCPA/CPRA Right to Delete (Cal. Civil Code §1798.105)

California consumers have the right to request deletion of their personal information under CCPA/CPRA. However, this right is subject to exceptions, including where retention is required by law.

### Conflict Resolution — WC Records

For personal information that is also WC matter data subject to CA Labor Code §5955:

**Glass Box's position:** CA Labor Code §5955 creates a legal obligation to retain WC records for 7 years. This obligation falls on the covered entity (the attorney firm) and on Glass Box as the business associate maintaining the records. A CCPA deletion request cannot override a statutory retention obligation.

**Procedure when a deletion request conflicts with retention requirements:**
1. Glass Box receives a deletion request for personal information that is subject to the 7-year WC records retention obligation
2. Glass Box notifies the requesting person within the CCPA response deadline that the request cannot be fully honored because the data is subject to a legal retention requirement
3. Glass Box states the specific legal basis for retaining the data and the applicable retention period
4. Glass Box confirms that upon expiration of the retention period, the data will be destroyed in the ordinary course per this policy
5. Glass Box honors the deletion request for any personal information that is not subject to the WC records retention requirement (e.g., marketing contact data, if separate from matter records)

### Law Firm State Bar Requirements

Some state bar jurisdictions impose additional records retention requirements on attorney files beyond the WC statutory minimum. If the attorney firm operates in a jurisdiction with a longer retention requirement:

1. The firm must notify Glass Box in writing of the applicable state bar retention requirement
2. Glass Box will adjust the retention schedule for that firm's matters to comply with the longer period
3. The additional retention period is documented in the Data Processing Agreement addendum

**Note:** Glass Box's default retention schedule is based on California requirements. Firms with obligations in other jurisdictions are responsible for identifying additional retention requirements and notifying Glass Box.

---

## Section 7: How to Populate This Template for Your Product

To adapt this template for a specific Glass Box product, complete the following steps:

1. **Identify all data categories** the product processes. Use the PHI Inventory from HIPAA_BOILERPLATE.md as a starting point.

2. **Assign a retention period to each category** from the legal basis table in Section 1. If no statutory period applies, state "contractual" and identify the contract term.

3. **Confirm the deletion method** is technically implemented. Do not state a deletion method that has not been verified with the engineering team.

4. **Describe the backup destruction process** specific to your product's backup infrastructure.

5. **Confirm the matter-closure procedure** matches the product's actual workflow. If the product does not have a matter-closure concept, adapt Section 5 accordingly.

6. **Legal review:** Before publishing, confirm with legal@glassboxsolutions.com that the retention periods and destruction procedures stated in the document are consistent with the executed DPA and BAAs for this product.

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
