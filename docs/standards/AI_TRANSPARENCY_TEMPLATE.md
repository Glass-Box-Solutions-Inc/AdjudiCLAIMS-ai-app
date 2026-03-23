# AI Transparency Template — "How AI Works In This Product"

**Audience:** T1 (Attorney Evaluator), T3 (IT/Compliance Officer), T4 (Developer/Integrator)
**Implementation Status:** Implemented
**Last Updated:** 2026-02-22
**Version:** 1.0

---

## Purpose

This template provides the standard "How AI Works In This Product" section for all Glass Box WC product documentation. Every product that uses AI must populate and include this section in its T1 documentation. Attorney evaluators require this information to assess professional responsibility risk, HIPAA compliance, and the reliability of AI-assisted outputs.

Copy the sections below into your product documentation, replace all bracketed fields with accurate product-specific values, and confirm all six quality gates in WC_DOCUMENTATION_STANDARDS.md before publishing.

---

## Section 1: Model Identification

List every AI model used in the product. A model is "used" if it processes any input related to user data, matters, documents, or case information, even if the user does not see the output directly.

| Model Name | Provider | Version / Snapshot Date | Confirmed in Production | Primary Function | BAA Executed |
|------------|----------|------------------------|------------------------|-----------------|-------------|
| Claude 3.5 Sonnet | Anthropic | [version or API snapshot date] | [YYYY-MM-DD] | [Document analysis, case summary, etc.] | Yes |
| GPT-4o | OpenAI | [version or API snapshot date] | [YYYY-MM-DD] | [Supplementary analysis, research, etc.] | Yes |
| Gemini 2.5 Flash | Google Vertex AI | [version or API snapshot date] | [YYYY-MM-DD] | [OCR, document extraction, etc.] | Yes |
| [Additional model] | [Provider] | [Version] | [Date] | [Function] | [Yes/No] |

**Instruction:** Delete rows for models your product does not use. If your product uses only one model, use a single-row table. The "Confirmed in Production" date must reflect when the engineering team last verified this model version is running in production, not the document publication date. Update this table with each model version change.

---

## Section 2: AI Decision Scope

The product's AI makes decisions in three categories. This section states which category applies to each AI-powered feature.

### Autonomous Decisions

The following AI decisions are presented directly to users without an in-application human review step:

| Feature | AI Action | Rationale |
|---------|-----------|-----------|
| [Feature name] | [What AI does, e.g., "Classifies document type and displays result"] | [Why this is acceptable without a review gate, e.g., "Classification is advisory; user can override and upload is not gated on classification result"] |

**Instruction:** If your product has no autonomous AI decisions (all outputs have a human review step), state: "This product has no autonomous AI decisions. All AI outputs are presented for user review before any action is taken." If your product does have autonomous decisions, list them all. Do not omit autonomous decisions to make the product appear safer than it is.

### Presented for Human Review

The following AI outputs are displayed to users and require human review before the user can take the next action:

| Feature | AI Output | Required Review Action |
|---------|-----------|----------------------|
| [Feature name] | [What AI produces, e.g., "Extracted PHI fields from medical record"] | [What user must do, e.g., "Paralegal must confirm each field before the record is saved to the matter"] |

### Flagged for Human Decision — AI Will Not Proceed

The following conditions cause the AI to halt and present a flag for human resolution. The AI will not produce an output or permit the workflow to continue until the flag is resolved by an authorized user.

| Trigger Condition | Flag Presented | Resolution Required |
|------------------|---------------|-------------------|
| [e.g., "OCR confidence below 85% on a PHI field"] | [e.g., "Low confidence extraction — attorney verification required"] | [e.g., "Supervising attorney must manually verify and confirm extracted value"] |
| [e.g., "Conflicting dates of injury across documents"] | [e.g., "Date conflict detected — review required before PD calculation"] | [e.g., "User must identify which date is correct and record the determination in the audit log"] |

---

## Section 3: Confidence and Uncertainty Communication

### Confidence Levels

This product communicates AI confidence to users using the following scheme:

| Confidence Level | Display | Meaning | Required User Action |
|-----------------|---------|---------|---------------------|
| High (>90%) | [e.g., Green indicator / no flag] | AI output meets reliability threshold for this feature | Review recommended; no gate required |
| Medium (70–90%) | [e.g., Yellow indicator / advisory flag] | AI output may contain errors; specific fields flagged | User should verify flagged fields before proceeding |
| Low (<70%) | [e.g., Red indicator / blocking flag] | AI output reliability insufficient; human determination required | User must verify and confirm before workflow continues |
| Not Available | [e.g., Grey indicator / "Confidence unavailable"] | Feature does not produce a confidence score for this output | Treat as Low confidence |

**Instruction:** Replace the confidence thresholds and display descriptions with your product's actual implementation. If your product does not produce confidence scores, state this explicitly and describe how the product communicates uncertainty to users instead.

### Uncertainty Communication

When the AI cannot produce a reliable output, the product communicates this to users as follows:

- [Describe what the user sees when the AI is uncertain — e.g., "The field is left blank with a 'Needs Review' label" or "The AI declines to produce an output and explains why in plain language"]
- [Describe whether the user can override an AI uncertainty flag and, if so, what is logged when they do]

---

## Section 4: Training Data Disclosure

**This section must be completed for every product. "We don't know" is not an acceptable answer.**

### Was This Product's AI Trained on Client Data?

[Select one and delete the others:]

**No.** This product uses [model name(s)] through API access under executed Business Associate Agreements. Per the executed BAAs, [Anthropic / OpenAI / Google / list providers] does not use client data, prompts, or responses to train, fine-tune, or evaluate its models. This restriction is contractually enforced and is verified annually by the Glass Box compliance team.

**No — with exception.** This product uses [model name] through API access under an executed BAA, and client data is not used for training. However, [describe the exception, e.g., "embeddings generated from client documents are stored in a Pinecone vector index associated with the client's account"]. This embedding storage [does / does not] constitute training data use as defined in the executed BAA.

**Yes.** This product uses a fine-tuned model that was trained on [describe the data, e.g., "anonymized California WC medical records"]. The training data was [describe how it was obtained and de-identified]. The model training process and data handling are documented at [link or reference].

### Data Used to Improve the Product

[Describe separately whether any user data, interaction logs, or output correction data is used to improve the product or its AI components. This is distinct from AI model training. Example: "Paralegal corrections to extracted field values are logged and used to identify systematic extraction errors for engineering review. This data is retained for [period] and is not shared with AI model providers."]

---

## Section 5: Multi-Model Architecture Disclosure

### Does This Product Use Multiple AI Models?

[Select one and delete the others:]

**No.** This product uses a single AI model: [model name and version]. All AI processing is performed by this model.

**Yes.** This product uses multiple AI models. The following diagram describes which model handles each function:

```
User Input
    |
    +-- Document Upload
    |       |
    |       +-- [Model A, e.g., Google Document AI] → OCR / text extraction
    |       |
    |       +-- [Model B, e.g., Claude 3.5 Sonnet] → Document classification
    |                                                  Case summary generation
    |                                                  PHI field extraction
    |
    +-- Legal Research Query
            |
            +-- [Model C, e.g., GPT-4o] → Case law retrieval and synthesis
```

**When multiple models handle the same document:**
[Describe the handoff: which model's output flows into the next model's input, and whether any intermediate outputs are stored or presented to users.]

**Disagreement handling:**
[If multiple models are used for the same task (e.g., consensus scoring), describe how disagreements between models are handled and what is presented to the user.]

---

## Section 6: Fallback Behavior

### AI Unavailability

When an AI model is unavailable due to provider outage, rate limit, or infrastructure failure:

| Scenario | Product Behavior | User Notification | Data Impact |
|----------|-----------------|------------------|------------|
| [AI provider API is down] | [e.g., "Document processing queue is paused; uploads are accepted but not processed until service is restored"] | [e.g., "Banner: 'AI processing temporarily unavailable. Your documents are queued and will be processed automatically when service resumes.'"] | [e.g., "No data is lost; uploaded documents are stored pending processing"] |
| [AI response times out] | [e.g., "Request is retried automatically up to 3 times; if all retries fail, the task is flagged for manual review"] | [e.g., "Flag: 'AI processing failed — manual review required'"] | [e.g., "The failed request is logged with a timestamp; no partial output is saved"] |
| [Rate limit reached] | [e.g., "Request is queued and processed when rate limit resets; user sees estimated wait time"] | [e.g., "Notice: 'Processing delayed — estimated completion: [time]'"] | [e.g., "No data impact; documents are held in queue"] |

### AI Output Rejection

When the AI produces output that fails internal validation checks:

[Describe what validation the product applies to AI output before displaying it to users — e.g., schema validation, field type checks, confidence thresholds — and what happens when validation fails.]

---

## Section 7: Output Validation

### Pre-Display Validation

Before AI output is displayed to any user, the product applies the following validation steps:

| Validation Step | What Is Checked | Failure Action |
|----------------|----------------|---------------|
| Schema validation | [e.g., "AI response conforms to expected JSON schema with required fields present"] | [e.g., "Output is rejected; error is logged; user sees 'Processing error — try again' message"] |
| Field type validation | [e.g., "Dates are valid calendar dates; ICD-10 codes are valid codes in the current code set"] | [e.g., "Invalid field is flagged with 'Verify this field' label; output is not blocked but field is highlighted"] |
| Confidence threshold | [e.g., "Extracted fields below 70% confidence are flagged for user review"] | [e.g., "Low-confidence fields are displayed with yellow 'Low confidence — verify' indicator"] |
| Hallucination risk check | [e.g., "Case citations are validated against a known-good citation format regex"] | [e.g., "Citations that do not match expected format are displayed with red 'Verify citation' indicator"] |

**Instruction:** Populate this table with your product's actual validation steps. If your product does not validate AI output before display, state this and explain the rationale.

### Source Traceability

[Describe whether AI outputs are linked to source documents so users can verify the AI's basis for its output. Example: "Each extracted field includes a 'View source' link that opens the source document page and highlights the text from which the field was extracted."]

---

## Section 8: Audit Trail for AI Decisions

### What Is Logged

The following events are recorded in the product's audit log for every AI operation:

| Event | Fields Logged |
|-------|--------------|
| AI processing initiated | User ID, matter ID, document ID, model used, timestamp, request parameters |
| AI output generated | Output type, confidence score (if available), model version, processing duration, timestamp |
| AI output displayed to user | User ID, output ID, timestamp |
| User reviews AI output | User ID, output ID, review action (confirmed / modified / rejected), timestamp |
| User modifies AI output | User ID, output ID, original value, modified value, timestamp |
| User overrides AI flag | User ID, flag ID, flag type, override reason (required), supervising attorney ID (if applicable), timestamp |
| AI output used in export or filing | User ID, output ID, export format, destination, timestamp |
| AI processing failure | Error type, model, request parameters, timestamp |

### Audit Log Retention

AI decision audit logs are retained for [period — must comply with DATA_RETENTION_TEMPLATE.md minimum]. Retention period: [state the period and the legal basis, e.g., "6 years per HIPAA 45 CFR §164.530(j)"].

### Audit Log Access

Attorney firms can access their audit log through:
- **In-product:** [Describe the UI location, e.g., "Settings > Compliance > Audit Log"]
- **API:** [Describe the endpoint, e.g., "GET /api/v1/audit-log?matter_id={id}&start={date}&end={date}"]
- **Export:** [Describe available export formats, e.g., "CSV, JSON, PDF"]

To request a complete audit log export for regulatory review or litigation hold, contact compliance@adjudica.ai.

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
