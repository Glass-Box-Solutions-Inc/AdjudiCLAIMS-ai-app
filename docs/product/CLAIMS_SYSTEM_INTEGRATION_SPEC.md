# Claims Management System Integration Specification

**Document Type:** Technical Design Specification
**Purpose:** Integration specifications for claims management systems (Guidewire, Duck Creek, Origami Risk) — AdjudiCLAIMS's equivalent of the attorney product's MerusCase integration
**Last Updated:** 2026-03-22
**Implementation Status:** Design Phase — Phase 2 Product (2027-2028)
**Attorney-Side Equivalent:** MerusCase integration (`server/integrations/meruscase/`)

---

## 1. Integration Landscape

### Attorney Product (Phase 1)

| System | Type | Integration | Status |
|--------|------|------------|--------|
| **MerusCase** | Legal practice management | OAuth2 REST API — matter import, document sync | Production (beta) |

### AdjudiCLAIMS (Phase 2)

| System | Type | Market Position | Integration Priority |
|--------|------|----------------|---------------------|
| **Guidewire ClaimCenter** | Claims management | ~35% market share in P&C; dominant in large carriers | **Priority 1** |
| **Duck Creek Claims** | Claims management | Strong mid-market; growing cloud adoption | **Priority 2** |
| **Origami Risk** | Risk management / claims | Strong in self-insured, public entity | **Priority 3** |
| **Sapiens ClaimsPro** | Claims management | Growing WC presence | Priority 4 |
| **Majesco Claims** | Claims management | Cloud-native; mid-market focus | Priority 4 |
| **BriteCore** | Full-stack insurance | API-first; growing | Priority 5 |

**Selection criteria for pilot:** Which system do the first 2-3 carrier pilot customers use? Integration priority will be confirmed by the carrier advisory board (target Q4 2026).

---

## 2. Common Integration Patterns

All claims management system integrations follow the same architecture, adapted per vendor API:

```
┌─────────────────────────────────────────────┐
│ AdjudiCLAIMS BY GLASS BOX                    │
│                                             │
│  ┌─────────────┐    ┌──────────────────┐   │
│  │ Integration │    │ Adjudica Claim   │   │
│  │ Service     │◄──►│ Data Model       │   │
│  │ (per vendor)│    │                  │   │
│  └──────┬──────┘    └──────────────────┘   │
│         │                                   │
└─────────┼───────────────────────────────────┘
          │ OAuth2 / API Key / mTLS
          ▼
┌─────────────────────────────────────────────┐
│ CLAIMS MANAGEMENT SYSTEM API                │
│ (Guidewire / Duck Creek / Origami)          │
│                                             │
│  Claims ─── Documents ─── Parties           │
│  Notes  ─── Activities ─── Reserves         │
└─────────────────────────────────────────────┘
```

### Data Flow Directions

| Direction | Data | Frequency |
|-----------|------|-----------|
| **Inbound (CMS → Adjudica)** | Claim data, documents, party info, activity history | On-demand import + optional periodic sync |
| **Outbound (Adjudica → CMS)** | AI-generated summaries, benefit calculations, compliance alerts, investigation notes | Manual push (examiner-initiated) or scheduled |
| **Bidirectional** | Claim status, reserve amounts, document classifications | Real-time via webhook or polling |

### Authentication Patterns

| Vendor | Auth Method | Token Management |
|--------|------------|-----------------|
| Guidewire | OAuth 2.0 (client credentials) or API key | Refresh token rotation; stored in Adjudica `Integration` table |
| Duck Creek | OAuth 2.0 or SAML | Same pattern |
| Origami Risk | API key + IP whitelist | Key rotation; stored encrypted |

---

## 3. Guidewire ClaimCenter Integration (Priority 1)

### API Overview

Guidewire ClaimCenter exposes a REST API (Cloud API) with JSONAPI-compliant endpoints:

| Endpoint | Data | Adjudica Use |
|----------|------|-------------|
| `GET /claims/{claimId}` | Claim details, status, loss date | Populate Adjudica claim record |
| `GET /claims/{claimId}/documents` | Document metadata + download URLs | Import documents into Adjudica for OCR/classification |
| `GET /claims/{claimId}/contacts` | Claimant, employer, providers, adjusters | Populate party information |
| `GET /claims/{claimId}/exposures` | Individual injury exposures within claim | Map to Adjudica claim body parts / injury details |
| `GET /claims/{claimId}/activities` | Claim activities (tasks, notes, correspondence) | Import activity history for timeline |
| `GET /claims/{claimId}/reserves` | Reserve lines by exposure/cost type | Import reserve data for reserve analysis features |
| `POST /claims/{claimId}/notes` | Create claim note | Push AI-generated summaries back to ClaimCenter |
| `POST /claims/{claimId}/documents` | Upload document | Push Adjudica-generated reports back |

### Data Mapping: Guidewire → Adjudica

| Guidewire Field | Adjudica Field | Notes |
|----------------|---------------|-------|
| `claim.lossDate` | `claim.dateOfInjury` | Direct mapping |
| `claim.claimNumber` | `claim.claimNumber` | Direct mapping |
| `claim.status` | `claim.status` | Enum mapping required |
| `claim.insured.displayName` | `claim.employerName` | May need parsing |
| `exposure.bodyPart` | `claim.injuryBodyParts[]` | Array aggregation |
| `contact[role=claimant]` | `claim.applicantName` | Role-based selection |
| `contact[role=adjuster]` | `claim.adjusterName/Phone/Email` | Role-based selection |
| `reserve.amount` | Reserve data model (new) | Per-exposure reserve lines |
| `document.name` + `document.mimeType` | `document.name` + `document.mimeType` | Standard file metadata |

### Sync Workflow

```
1. INITIAL IMPORT
   Examiner selects claim in Guidewire → clicks "Import to Adjudica"
   → Adjudica fetches claim data via API
   → Creates ExaminerClaim record with mapped fields
   → Fetches document list → queues document downloads
   → Each document: download → OCR → classify → extract fields → generate events
   → Claim record enriched with extracted data

2. ONGOING SYNC (Optional)
   Periodic poll (configurable: 1hr, 4hr, daily)
   → Check for new documents, activity updates, reserve changes
   → Import new documents → process through pipeline
   → Update claim status if changed

3. PUSH BACK (Examiner-Initiated)
   Examiner generates AI summary or compliance report in Adjudica
   → Clicks "Push to ClaimCenter"
   → Adjudica creates note or uploads document to Guidewire
   → Confirmation logged in audit trail
```

### Implementation: Temporal Workflow

Following the MerusCase integration pattern (`server/temporal/meruscase/`):

```typescript
// Guidewire sync workflow (parallel to meruscase sync)
interface GuidewireSyncWorkflow {
  // Import claim from Guidewire
  importClaim(claimId: string, orgId: string): Promise<ExaminerClaim>;

  // Import documents from Guidewire
  importDocuments(claimId: string, orgId: string): Promise<Document[]>;

  // Periodic sync check
  syncCheck(claimId: string, lastSyncAt: DateTime): Promise<SyncResult>;

  // Push summary back to Guidewire
  pushNote(claimId: string, noteContent: string): Promise<void>;
  pushDocument(claimId: string, documentId: string): Promise<void>;
}
```

---

## 4. Duck Creek Claims Integration (Priority 2)

### API Overview

Duck Creek exposes REST APIs with standard CRUD operations:

| Endpoint Pattern | Data | Adjudica Use |
|-----------------|------|-------------|
| `GET /claims/{id}` | Claim details | Populate claim record |
| `GET /claims/{id}/claimDocuments` | Documents | Import for processing |
| `GET /claims/{id}/claimParties` | Parties (claimant, employer, adjuster) | Party data |
| `GET /claims/{id}/claimCoverages` | Coverage details | Policy information |
| `GET /claims/{id}/claimActivities` | Activity history | Timeline population |
| `POST /claims/{id}/claimNotes` | Create note | Push summaries back |

### Key Differences from Guidewire

| Aspect | Guidewire | Duck Creek |
|--------|-----------|-----------|
| API style | JSONAPI with relationships | Standard REST with nested objects |
| Auth | OAuth 2.0 client credentials | OAuth 2.0 authorization code |
| Document storage | Integrated document management | Often separate DMS (OnBase, etc.) |
| Reserve access | Direct via exposure endpoints | Via coverage/reserve endpoints |
| Webhook support | Available (Cloud events) | Available (event subscriptions) |

### Data Mapping

Same conceptual mapping as Guidewire but with Duck Creek-specific field names. A mapping configuration layer abstracts the vendor differences:

```typescript
interface ClaimsSystemMapping {
  vendor: 'guidewire' | 'duck_creek' | 'origami';
  claimNumberField: string;
  dateOfInjuryField: string;
  claimantNameField: string;
  employerNameField: string;
  adjusterFields: { name: string; phone: string; email: string };
  bodyPartField: string;
  reserveFields: { amount: string; type: string; exposure: string };
  documentListEndpoint: string;
  documentDownloadEndpoint: string;
}
```

---

## 5. Origami Risk Integration (Priority 3)

### API Overview

Origami Risk serves self-insured employers, public entities, and risk pools. Its API is more focused on risk management than pure claims:

| Capability | Notes |
|-----------|-------|
| Claims CRUD | Standard REST endpoints |
| Document management | Integrated; API access to uploaded documents |
| Financial data | Reserves, payments, recoveries |
| Workflow | Configurable workflows with API triggers |
| Reporting | API access to report data |

### Key Differences

| Aspect | Guidewire / Duck Creek | Origami Risk |
|--------|----------------------|-------------|
| Primary user | Insurance carriers / TPAs | Self-insured employers, public entities |
| Claim complexity | High (full WC lifecycle) | Moderate (often pre-litigation focused) |
| Attorney integration | External panel counsel | Often in-house counsel or simpler arrangement |
| Volume | 1000s-10000s claims per org | 100s-1000s claims per org |

---

## 6. Vendor-Agnostic Integration Layer

### Abstract Interface

All vendor integrations implement the same abstract interface, enabling AdjudiCLAIMS to work identically regardless of underlying CMS:

```typescript
interface ClaimsSystemAdapter {
  // Connection
  connect(credentials: IntegrationCredentials): Promise<void>;
  testConnection(): Promise<boolean>;

  // Claim operations
  getClaim(claimId: string): Promise<StandardizedClaim>;
  listClaims(filters: ClaimFilter): Promise<StandardizedClaim[]>;
  getClaimDocuments(claimId: string): Promise<DocumentMetadata[]>;
  downloadDocument(documentId: string): Promise<Buffer>;
  getClaimParties(claimId: string): Promise<Party[]>;
  getClaimReserves(claimId: string): Promise<ReserveLine[]>;
  getClaimActivities(claimId: string): Promise<Activity[]>;

  // Push operations
  createNote(claimId: string, note: NoteContent): Promise<string>;
  uploadDocument(claimId: string, document: UploadDocument): Promise<string>;
  updateClaimField(claimId: string, field: string, value: any): Promise<void>;

  // Sync
  getModifiedSince(sinceDate: DateTime): Promise<ModifiedClaims>;
}

interface StandardizedClaim {
  externalId: string;
  claimNumber: string;
  dateOfInjury: DateTime;
  claimantName: string;
  employerName: string;
  insurerName: string;
  adjusterName: string;
  adjusterPhone: string;
  adjusterEmail: string;
  bodyParts: string[];
  status: ClaimStatus;
  reserves: ReserveLine[];
}
```

### Adapter Registration

```typescript
// Vendor adapter registry
const adapters: Record<string, () => ClaimsSystemAdapter> = {
  'guidewire': () => new GuidewireAdapter(),
  'duck_creek': () => new DuckCreekAdapter(),
  'origami': () => new OrigamiAdapter(),
};

// Usage
const adapter = adapters[integration.vendor]();
await adapter.connect(integration.credentials);
const claim = await adapter.getClaim(externalClaimId);
```

---

## 7. Data Privacy and Security

### PHI Handling

All CMS integrations handle PHI (medical records, claimant PII). Requirements:

| Requirement | Implementation |
|------------|---------------|
| BAA with CMS vendor | Required before integration goes live |
| Encryption in transit | TLS 1.3 for all API calls |
| Encryption at rest | AES-256 for stored documents (GCS default) |
| Minimum necessary | Only fetch claim data needed for Adjudica features |
| Audit trail | Log all data imports and exports with timestamps |
| No model training | AI providers contractually prohibited from using imported data |

### Credential Storage

```
Integration credentials stored in:
- Database: `Integration` model (encrypted)
- Secrets: GCP Secret Manager for API keys and OAuth secrets
- NEVER in code, logs, or environment variables
```

---

## 8. Implementation Roadmap

| Phase | Milestone | Timeline |
|-------|-----------|----------|
| **Research** | Identify first 2-3 pilot carrier CMS platforms | Q4 2026 (carrier advisory board) |
| **Adapter 1** | Build first vendor adapter (likely Guidewire) | Month 1-3 of Phase 2 development |
| **Testing** | End-to-end testing with carrier sandbox environment | Month 3-4 |
| **Pilot** | Deploy with first pilot carrier | Month 4-6 |
| **Adapter 2** | Build second vendor adapter based on pilot demand | Month 6-9 |
| **Adapter 3** | Third vendor adapter | Month 9-12 |
| **General availability** | All priority adapters available | Month 12+ |

---

## 9. Open Questions

| # | Question | Decision Needed By |
|---|---------|-------------------|
| 1 | Which CMS do our first pilot carriers use? | Carrier advisory board (Q4 2026) |
| 2 | Do carriers want bidirectional sync or import-only? | Pilot carrier discovery |
| 3 | What cadence for ongoing sync (real-time webhooks vs. polling)? | Engineering + carrier IT teams |
| 4 | Do we need to integrate with separate DMS (OnBase, Hyland) for document access? | Depends on carrier architecture |
| 5 | Do carriers want to push Adjudica outputs to ClaimCenter as notes or as structured data? | Pilot carrier preference |

---

**Document Status:** Design phase — confirm priorities with carrier advisory board
**Owner:** Engineering / Product / Business Development
**Next Action:** Form carrier advisory board; confirm CMS priorities; obtain sandbox access

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
