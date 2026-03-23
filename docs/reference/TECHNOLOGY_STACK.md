# Adjudica AI - Complete Technology Stack

**Last Updated:** 2026-01-26
**Organization:** Glass Box Solutions → Glass Box Solutions, Inc.
**Maintained By:** Engineering Team

---

## Organizational Structure

```
Glass Box Solutions (Parent Organization)
    └── Glass Box Solutions, Inc. (Operating Company)
            ├── Corporate Website (glassboxsolutions.com)
            ├── Product Website (adjudica.ai)
            ├── PD Calculator (calculator.adjudica.ai)
            └── Attorney Platform (foundingusers.adjudica.ai)
```

---

## Standard Tech Stack

**All new projects MUST use this standardized stack unless explicitly approved otherwise.**

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **View** | React Router 7 (SSR) | Server-side rendering, performance optimization |
| **Backend** | Fastify | High-performance REST APIs, production-proven in Adjudica platform |
| **ORM** | Prisma | Schema-first, migrations, type generation |
| **Database** | PostgreSQL | Enterprise-grade relational database |
| **Auth** | BetterAuth | Modern auth with organization/team management |
| **State** | Zustand + TanStack Query | UI state (Zustand) + Server state (TanStack Query) |
| **Forms** | React Hook Form + Zod | onBlur validation, backend field-level errors |
| **HTTP** | Native fetch or ky | Modern, standard fetch-based APIs |
| **Language** | TypeScript | Strict mode, end-to-end type safety |

### Key Architectural Patterns

1. **SSR Loaders** → Prefetch data → TanStack Query hydration
2. **Zustand** → UI state (modals, selections)
3. **TanStack Query** → Server state (caching, refetch)
4. **Zod validation** → Both frontend and backend
5. **Actions** → Only for form redirects (login, register), not data mutations

---

## Project-Specific Technology Stacks

### 1. Corporate Website (glassboxsolutions.com)

**Status:** ✅ LIVE
**Repository:** `projects/glass-box-website/`
**Deployment:** Vercel

#### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | 16.1.1 |
| **Runtime** | React | 19.2.3 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **CSS Processing** | PostCSS | Latest |
| **Icons** | Lucide React | 0.562.0 |
| **Deployment** | Vercel | N/A |

#### Architecture

- **Pattern:** Static site generation (SSG) with dynamic components
- **Rendering:** Server components where possible, client components for interactivity
- **API Routes:** Next.js API routes for contact forms, analytics
- **Performance:** Image optimization via Next.js Image component

#### Site Structure

```
/ (homepage)
├── /company (About, Team, Careers)
├── /solutions (Product solutions)
├── /platform (Platform features)
│   └── /platform/adjudica (Adjudica product page)
├── /why-glass-box (Differentiators)
├── /resources (Blog, Case Studies)
├── /pricing (Pricing tiers)
└── /contact (Contact form)
```

---

### 2. Product Marketing Website (adjudica.ai)

**Status:** ✅ LIVE
**Repository:** `projects/adjudica-ai-website/`
**Deployment:** Vercel

#### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (Single Page) | 16.1.1 |
| **Runtime** | React | 19.2.3 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Typography** | Playfair Display + Plus Jakarta Sans | N/A |
| **Design System** | Dark theme (#0a0a0f + #d69e2e gold) | Custom |

#### Architecture

- **Pattern:** Single-page teaser site
- **Rendering:** Server-side rendered (SSR)
- **Lead Capture:** Form with validation → API endpoint → CRM/Email
- **Interactive Demo:** Hover-to-source showcase (gold underlines)

#### Design Tokens

```css
/* Color Palette */
--background: #0a0a0f (near-black)
--accent-gold: #d69e2e (California gold)
--text-primary: #ffffff
--text-secondary: rgba(255,255,255,0.8)

/* Typography */
--font-heading: 'Playfair Display', serif
--font-body: 'Plus Jakarta Sans', sans-serif
```

---

### 3. PD Ratings Calculator (calculator.adjudica.ai)

**Status:** ✅ LIVE
**Repository:** Unknown (needs to be added to version control)
**Deployment:** Unknown

#### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React (Hooks) | Unknown |
| **State** | Component state + localStorage | N/A |
| **Styling** | Inline CSS | N/A |
| **AI** | Webhook API (rate limited) | N/A |
| **Analytics** | Google Analytics 4 | N/A |
| **Date Handling** | Native Date API | N/A |

#### Core Features

1. **Multi-Date Injury Support** - Track multiple DOIs per case
2. **AI-Assisted Occupational Classification** - 90+ coded categories
3. **Extremity Conversion Toolkit** - AMA Guides 5th Edition factors
4. **Money Chart Integration** - PD indemnity estimation

#### Calculation Logic

```
Input: WPI% → FEC Adjustment → Occupational → Age → Apportionment → Final PD%
                ↓
Supports three schedules:
├── 1997 PDRS (no FEC)
├── 2005 PDRS (SB 899, FEC multipliers 1.10-1.40)
└── 2013+ PDRS (SB 863, DFEC lookup table 1.4)
```

#### Data Persistence

- **Method:** Browser localStorage
- **Keys:** User input data, calculation history
- **Privacy:** No server-side storage, all client-side

#### Compliance

- **Case Law:** Dalen v. WCAB, Almaraz/Guzman, Blackledge
- **Statutes:** Labor Code §4453, §4658, §4659
- **Disclaimer:** AI recommendations advisory only

---

### 4. Attorney Platform (foundingusers.adjudica.ai)

**Status:** 🚧 BETA
**Repository:** `adjudica-app-review/`
**Deployment:** Google Cloud Storage or Cloud Run (planned)

#### Technology Stack - Frontend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React Router | 7.8.2 | SSR routing framework |
| **Runtime** | React | 18.3.1 | UI library |
| **Language** | TypeScript | 5.4.0 | Type safety |
| **State (UI)** | Zustand | 5.0.8 | Client-side UI state |
| **State (Server)** | TanStack Query | 5.85.5 | Server data caching/sync |
| **Forms** | React Hook Form | 7.62.0 | Form state management |
| **Validation** | Zod | 3.25.76 | Schema validation |
| **Styling** | Tailwind CSS | 3.4.0 | Utility-first CSS |
| **UI Components** | Radix UI | Latest | Accessible primitives |
| **Icons** | Lucide React | Latest | Icon library |
| **HTTP** | Native fetch / ky | N/A | API communication |

#### Technology Stack - Backend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Fastify | 5.2.1 | High-performance REST API |
| **Language** | TypeScript | 5.4.0 | Type safety |
| **ORM** | Prisma | 6.15.0 | Database abstraction |
| **Database** | PostgreSQL | Latest | Primary data store |
| **Auth** | BetterAuth | 1.3.8 | Authentication + organizations |
| **Session** | BetterAuth sessions | N/A | Secure session management |
| **CORS** | @fastify/cors | Latest | Cross-origin resource sharing |
| **Rate Limiting** | @fastify/rate-limit | Latest | API protection |
| **Validation** | Zod | 3.25.76 | Request/response validation |

#### Technology Stack - AI/ML

| Provider | Purpose | Integration |
|----------|---------|-------------|
| **Google Gemini** | Chat, document analysis, drafting, legal drafting | Vertex AI SDK |
| **Google Vertex AI** | Enterprise AI platform | Vertex AI SDK |
| **Google Document AI** | OCR, form extraction | GCP SDK |
| **Langfuse** | LLM tracing & monitoring | Direct integration |
| **LangChain** | AI orchestration | Core framework |

#### Technology Stack - Storage & Files

| Technology | Purpose | Environment |
|------------|---------|-------------|
| **Google Cloud Storage** | File storage | Both |
| **pdf-lib** | PDF generation | Client-side |
| **pdfjs-dist** | PDF rendering/viewing | Client-side |
| **mammoth** | Word (.docx) parsing | Server-side |
| **docxtemplater** | Template-based doc generation | Server-side |

#### Technology Stack - DevOps & Monitoring

| Tool | Purpose | Status |
|------|---------|--------|
| **Docker** | Containerization | ✅ Configured |
| **docker-compose** | Local orchestration | ✅ Working |
| **Sentry** | Error monitoring | ⚠️ Configured, needs production key |
| **Google Analytics 4** | User analytics | ⚠️ Needs configuration |
| **Vercel** | Deployment option | ⚠️ Alternative to GCS |

#### Database Schema (Prisma)

**Core Entities:**

```prisma
// Multi-tenant isolation
model LawFirm {
  id          String          @id @default(cuid())
  name        String
  members     LawFirmMember[]
  matters     Matter[]
  templates   Template[]
  // ...
}

// Matter-centric design
model Matter {
  id              String          @id @default(cuid())
  lawFirmId       String
  lawFirm         LawFirm         @relation(fields: [lawFirmId])
  applicantName   String
  documents       Document[]
  claims          Claim[]
  facts           MatterFact[]
  events          MatterEvent[]
  drafts          Draft[]
  templateDrafts  TemplateDraft[]
  customDrafts    CustomDraft[]
  // ...
}

// Document processing
model Document {
  id              String      @id @default(cuid())
  matterId        String
  matter          Matter      @relation(fields: [matterId])
  originalName    String
  storagePath     String
  mimeType        String
  ocrText         String?     // OCR extracted text
  ocrStatus       OcrStatus
  // ...
}

// AI-extracted facts
model MatterFact {
  id          String  @id @default(cuid())
  matterId    String
  matter      Matter  @relation(fields: [matterId])
  factText    String
  source      String  // Document reference
  confidence  Float
  // ...
}

// Timeline events
model MatterEvent {
  id          String    @id @default(cuid())
  matterId    String
  matter      Matter    @relation(fields: [matterId])
  eventDate   DateTime
  eventType   String
  description String
  // ...
}

// Document drafts (3 types)
model Draft {
  id          String      @id @default(cuid())
  matterId    String
  matter      Matter      @relation(fields: [matterId])
  formType    String      // DWC form type
  formData    Json        // Form field values
  status      DraftStatus
  // ...
}

model TemplateDraft {
  id          String      @id @default(cuid())
  matterId    String
  matter      Matter      @relation(fields: [matterId])
  templateId  String
  template    Template    @relation(fields: [templateId])
  content     String
  // ...
}

model CustomDraft {
  id              String      @id @default(cuid())
  matterId        String
  matter          Matter      @relation(fields: [matterId])
  prompt          String      // User's natural language request
  generatedContent String
  llmProvider     String      // gemini
  // ...
}
```

#### Authentication Architecture

**BetterAuth Multi-Tenant:**

```typescript
// Session-based auth
// User → LawFirmMember → LawFirm
// Supports multiple roles: ADMIN, ATTORNEY, CLERK

// Row-level security via Prisma middleware
// All queries filtered by lawFirmId automatically

// Matter-level access control
// ATTORNEY: only matters assigned to them
// ADMIN: all firm matters
// CLERK: matters with explicit access grants
```

#### API Architecture

**RESTful Endpoints:**

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/session

GET    /api/matters
POST   /api/matters
GET    /api/matters/:id
PATCH  /api/matters/:id
DELETE /api/matters/:id

POST   /api/matters/:id/documents
GET    /api/documents/:id
DELETE /api/documents/:id

GET    /api/matters/:id/facts
POST   /api/matters/:id/facts/extract  # Trigger AI extraction

GET    /api/matters/:id/timeline

POST   /api/drafts/dwc-form
POST   /api/drafts/template
POST   /api/drafts/custom  # AI-generated

POST   /api/ai/chat
POST   /api/ai/analyze-document
```

#### State Management Pattern

```typescript
// UI State (Zustand) - Client-only concerns
const useUIStore = create((set) => ({
  sidebarOpen: true,
  selectedMatterId: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Server State (TanStack Query) - Data from APIs
const { data: matters, isLoading } = useQuery({
  queryKey: ['matters', firmId],
  queryFn: () => fetchMatters(firmId),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});

// Form State (React Hook Form)
const form = useForm({
  resolver: zodResolver(matterSchema),
  mode: 'onBlur', // Validate on blur, not on change
});
```

#### SSR + Data Loading Pattern

```typescript
// Loader prefetches data for SSR
export async function loader({ params }: LoaderFunctionArgs) {
  const queryClient = new QueryClient();

  // Prefetch data server-side
  await queryClient.prefetchQuery({
    queryKey: ['matter', params.matterId],
    queryFn: () => fetchMatter(params.matterId),
  });

  // Hydrate client-side cache
  return json({ dehydratedState: dehydrate(queryClient) });
}

// Component receives hydrated data
export default function MatterDetail() {
  const { matterId } = useParams();

  // Data already in cache from SSR
  const { data: matter } = useQuery({
    queryKey: ['matter', matterId],
    queryFn: () => fetchMatter(matterId),
  });

  return <div>{matter.applicantName}</div>;
}
```

#### Demo Accounts

| Email | Name | Role | Password |
|-------|------|------|----------|
| `lawyer@adjudica.ai` | John Smith | Admin Attorney | `password123` |
| `sarah.johnson@adjudica.ai` | Sarah Johnson | Attorney | `password123` |
| `michael.chen@adjudica.ai` | Michael Chen | Attorney | `password123` |
| `clerk@adjudica.ai` | Clerk User | Clerk | `password123` |

**Law Firm:** Smith & Associates Law Firm (Los Angeles)

#### Deployment Options

**Option 1: Google Cloud Run (Recommended)**
- Containerized deployment
- Auto-scaling
- Integrated with GCP ecosystem

**Option 2: Google Cloud Storage (Static)**
- Build static React Router app
- Deploy to GCS bucket
- CDN via Cloud CDN

**Scripts:**
- `deploy-to-gcs.ps1` - GCS static deployment
- `Dockerfile` - Container image
- `docker-compose.yml` - Local development

---

## Development Workflows

### Local Development

**Prerequisites:**
- Node.js 20+ (LTS)
- PostgreSQL 16+
- Docker & Docker Compose (for platform)

**Setup (Platform):**

```bash
# Clone repository
cd adjudica-app-review

# Install dependencies
npm install

# Start PostgreSQL (via Docker)
docker-compose up -d postgres

# Setup database
npx prisma migrate dev

# Seed demo data
npx prisma db seed

# Start dev server
npm run dev
```

**Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/adjudica"

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:5173"

# AI Provider
GEMINI_API_KEY="..."
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"

# Storage
GCS_BUCKET="adjudica-documents"

# Monitoring
SENTRY_DSN="https://..."
LANGFUSE_PUBLIC_KEY="pk-..."
LANGFUSE_SECRET_KEY="sk-..."
```

### Testing Strategy

**Unit Tests:**
- Vitest for frontend components
- Vitest for backend API routes
- Coverage target: 80%+

**Integration Tests:**
- API endpoint testing
- Database interaction testing
- Auth flow testing

**E2E Tests:**
- Playwright for critical user flows
- Login → Create Matter → Upload Document → Generate Draft

**Visual Testing:**
- Specticles for UI verification
- Automated screenshots on deploy
- VLM-powered visual regression

---

## Performance Benchmarks

### Corporate Website (glassboxsolutions.com)

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Time to Interactive | < 3.5s | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |

### Product Website (adjudica.ai)

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.0s | ✅ |
| Largest Contentful Paint | < 2.0s | ✅ |
| Time to Interactive | < 2.5s | ✅ |

### PD Calculator (calculator.adjudica.ai)

| Metric | Target | Status |
|--------|--------|--------|
| Initial Load | < 2.0s | ⚠️ Unknown |
| Calculation Time | < 100ms | ✅ |
| AI Classification | < 3s | ✅ |

### Attorney Platform (foundingusers.adjudica.ai)

| Metric | Target | Status |
|--------|--------|--------|
| SSR Time | < 500ms | 🚧 TBD |
| API Response | < 200ms | 🚧 TBD |
| Document Upload | < 5s per MB | 🚧 TBD |
| OCR Processing | < 30s per doc | 🚧 TBD |
| AI Fact Extraction | < 45s per doc | 🚧 TBD |

---

## Security & Compliance

### HIPAA Compliance

**Platform Features:**

| Control | Implementation | Status |
|---------|---------------|--------|
| **Encryption at Rest** | Prisma field-level encryption | ✅ Implemented |
| **Encryption in Transit** | TLS 1.3 | ✅ Required |
| **Access Control** | BetterAuth RBAC + multi-tenant | ✅ Implemented |
| **Audit Logging** | Database activity logs | ⚠️ Partial |
| **Data Minimization** | Only collect necessary PHI | ✅ By design |
| **BAA** | Business Associate Agreement | 📄 Template ready |

### Security Headers

```typescript
// Fastify security headers
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
```

### Data Retention

| Data Type | Retention Period | Deletion Method |
|-----------|-----------------|-----------------|
| **User Accounts** | Until account deletion | Soft delete → hard delete after 30 days |
| **Matter Data** | 7 years (legal requirement) | Archive → purge after retention |
| **Documents** | 7 years | GCS lifecycle policy |
| **Audit Logs** | 7 years | Append-only, immutable |
| **AI Interactions** | 90 days | Automated deletion |

---

## Monitoring & Observability

### Error Tracking (Sentry)

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Fastify(),
  ],
});
```

### LLM Tracing (Langfuse)

```typescript
import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
});

// Trace AI interactions
const trace = langfuse.trace({
  name: "document-analysis",
  userId: user.id,
  metadata: { matterId, documentId },
});
```

### Analytics (Google Analytics 4)

**Events Tracked:**
- Page views
- Document uploads
- Draft creations
- AI interactions
- Form submissions
- Search queries

---

## Third-Party Services

### Current Integrations

| Service | Purpose | Cost Model |
|---------|---------|------------|
| **Vercel** | Hosting (websites) | Free → $20/mo |
| **Google Cloud Platform** | Platform hosting, Document AI | Pay-per-use |
| **Google Gemini** | AI text generation, legal drafting | Pay-per-use (Vertex AI pricing) |
| **Sentry** | Error monitoring | Free → $26/mo |
| **Langfuse** | LLM observability | Free (self-hosted option) |

### Future Integrations (Planned)

| Service | Purpose | Timeline |
|---------|---------|----------|
| **Stripe** | Payment processing | Q2 2026 |
| **Twilio** | SMS notifications | Q2 2026 |
| **SendGrid** | Transactional email | Q1 2026 |
| **Zapier** | Workflow automation | Q3 2026 |

---

## Infrastructure

### Development Environment

```
Local Machine
├── Node.js 20+ (LTS)
├── PostgreSQL 16 (Docker)
├── Google Cloud Storage (document storage)
├── Redis (future - caching, sessions)
└── VS Code / Cursor / JetBrains
```

### Staging Environment (Planned)

```
Google Cloud Platform (us-central1)
├── Cloud Run (platform backend)
├── Cloud SQL (PostgreSQL 16)
├── Cloud Storage (documents)
├── Secret Manager (credentials)
└── Cloud CDN (static assets)
```

### Production Environment (Target)

```
Google Cloud Platform (us-central1 + us-east1)
├── Cloud Run (auto-scaling, multi-region)
├── Cloud SQL (HA, replicas)
├── Cloud Storage (multi-region, versioning)
├── Cloud CDN (global edge caching)
├── Cloud Armor (DDoS protection)
└── Cloud Monitoring (logs, metrics, traces)
```

---

## Version Control & CI/CD

### Git Workflow

**Branches:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development
- `hotfix/*` - Production hotfixes

**Commit Convention:**
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scopes: auth, matters, documents, drafts, ai, ui, api
```

**Example:**
```
feat(drafts): add AI-powered custom draft generation
fix(auth): resolve session expiration bug
docs(readme): update deployment instructions
```

### GitHub Actions (Planned)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: ./scripts/deploy-staging.sh

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: ./scripts/deploy-production.sh
```

---

## Documentation Standards

### Code Documentation

**TypeScript/JavaScript:**
```typescript
/**
 * Extracts facts from a document using AI
 * @param documentId - The document to analyze
 * @param matterId - The associated matter
 * @returns Array of extracted facts with confidence scores
 */
async function extractFacts(
  documentId: string,
  matterId: string
): Promise<MatterFact[]> {
  // Implementation
}
```

**Prisma Schema:**
```prisma
/// Represents a workers' compensation case
model Matter {
  /// Unique identifier (CUID)
  id              String          @id @default(cuid())

  /// Parent law firm (multi-tenant isolation)
  lawFirmId       String
  lawFirm         LawFirm         @relation(fields: [lawFirmId])

  /// Applicant's full legal name
  applicantName   String

  // ... more fields
}
```

### API Documentation

**OpenAPI/Swagger (Planned):**
- Document all REST endpoints
- Include request/response schemas
- Provide example requests
- List error codes and meanings

---

## Key Decisions & Rationale

### Why Fastify over NestJS?

| Factor | Fastify | NestJS |
|--------|---------|--------|
| **Performance** | ✅ Fastest Node.js framework | ⚠️ Slower (abstractions) |
| **TypeScript** | ✅ Excellent inference | ✅ Excellent support |
| **Learning Curve** | ✅ Simpler, less opinionated | ⚠️ Steeper (Angular-like) |
| **Startup Time** | ✅ Fast | ⚠️ Slower |
| **Production Use** | ✅ Proven in Adjudica platform | ✅ Enterprise-ready |

**Decision:** Fastify - already proven in production, faster, simpler.

### Why React Router 7 over Next.js 15?

| Factor | React Router 7 | Next.js 15 |
|--------|---------------|------------|
| **SSR** | ✅ Full SSR support | ✅ Full SSR support |
| **Backend** | ✅ Separate Fastify backend | ⚠️ API routes (not Fastify) |
| **Flexibility** | ✅ More control | ⚠️ Opinionated |
| **Deployment** | ✅ Any Node.js host | ⚠️ Best on Vercel |

**Decision:** React Router 7 - allows separate backend (Fastify), more flexible deployment.

### Why Zustand + TanStack Query over Redux Toolkit?

| Factor | Zustand + TanStack Query | Redux Toolkit |
|--------|-------------------------|---------------|
| **Boilerplate** | ✅ Minimal | ⚠️ More setup |
| **Server State** | ✅ TanStack Query handles it | ⚠️ RTK Query (good but complex) |
| **Learning Curve** | ✅ Simpler | ⚠️ Steeper |
| **Performance** | ✅ Excellent | ✅ Excellent |

**Decision:** Zustand + TanStack Query - simpler, separates concerns (UI vs server state).

### Why Google Gemini Exclusively?

**Rationale:**
1. **GCP integration** - Native integration with our Cloud infrastructure
2. **Cost optimization** - Gemini 2.5 Flash provides excellent price-to-performance
3. **Enterprise support** - Vertex AI provides SLAs, zero data retention, and compliance
4. **Unified vendor** - Single provider simplifies BAA, DPA, and compliance management

**Model usage:**
- **Gemini 2.5 Flash:** Chat, document classification, drafting, analysis
- **Document AI:** Specialized OCR with form understanding

---

## Roadmap & Future Technology

### Short-Term (Q1 2026)

- [ ] **Production deployment** (foundingusers.adjudica.ai)
- [ ] **E2E test coverage** (Playwright)
- [ ] **Monitoring dashboard** (Grafana + Prometheus)
- [ ] **Automated backups** (Cloud SQL)

### Medium-Term (Q2-Q3 2026)

- [ ] **Mobile app** (React Native or Expo)
- [ ] **Real-time collaboration** (WebSockets + Yjs)
- [ ] **Vector search** (PostgreSQL pgvector for document RAG)
- [ ] **Workflow automation** (complete feature)

### Long-Term (H2 2026+)

- [ ] **Public API** (REST + GraphQL)
- [ ] **White-label platform** (custom branding)
- [ ] **Multi-language support** (Spanish for CA market)
- [ ] **AI training** (fine-tune on WC data)

---

## Contact & Support

**Engineering Team:**
- **Lead Developer:** Alexander D. Brewsaugh (Alex@Adjudica.ai)
- **Development Partner:** BrightDock (Stephen Cefali)

**Documentation:**
- **This Repository:** https://github.com/GlassBoxSolutions/adjudica-documentation
- **Tech Stack (this file):** `product/technical/TECHNOLOGY_STACK.md`
- **Platform Analysis:** `product/technical/PLATFORM_ANALYSIS.md`
- **PD Calculator:** `product/technical/PD_CALCULATOR_DOCUMENTATION.md`

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
