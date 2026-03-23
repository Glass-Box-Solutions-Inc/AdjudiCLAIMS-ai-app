# AdjudiCLAIMS

AI-powered workers' compensation claims analysis platform. From black box to glass box.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7 (SSR) |
| Server | Fastify 5, Node.js 20 |
| Database | PostgreSQL 15 + pgvector |
| ORM | Prisma 6 |
| AI | Anthropic Claude, Google Vertex AI, Document AI |
| Language | TypeScript (strict mode) |
| Testing | Vitest |
| Build | Vite 6 |

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your local values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Frontend runs on **http://localhost:4900**, API on **http://localhost:4901**.

## Documentation

- **[docs/](./docs/)** - Architecture, design decisions, and technical documentation
- **[CLAUDE.md](./CLAUDE.md)** - Development instructions and project conventions

## Private Repository

This is a private repository owned by Glass Box Solutions, Inc. Unauthorized access or distribution is prohibited. See [LICENSE](./LICENSE).
