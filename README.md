
# PULSE-R24 — Monorepo

Monorepo scaffold for the PULSE-R24 rebuild. This repository provides a
backend-first, modular foundation for the intelligence platform.

Layout

- `apps/web` — Next.js 15 frontend (app directory, Tailwind)
- `apps/worker` — BullMQ workers and job processors
- `packages/*` — shared packages (ui, database, auth, logger, config, types)

Quick start (local)

```bash
pnpm install
pnpm dev
```

Development notes

- Environment variables: see `.env.example` and `docs/env.md` for required keys.
- Database: Prisma schema is in `packages/database/prisma/schema.prisma`.
- Auth: Auth.js templates are in `packages/auth` (wire `@authjs/prisma-adapter`).
- UI: Design primitives live in `packages/ui` and are consumed by `apps/web`.

Basic seed workflows:

```bash
pnpm prisma:generate
pnpm seed:bootstrap
```

CI

Basic CI workflow is included at `.github/workflows/ci.yml`.

