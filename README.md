# PULSE-R24 Monorepo

Clean rebuild of the PULSE-R24 intelligence report management platform.

Current validated release: `v1.0.1-rc1` (`8e646b1e07a4bb295024fbf70f934ba9a7285965`).

## Layout

- `apps/web` - Next.js 15 dashboard application.
- `apps/worker` - reserved worker app, not required for the current demo workflow.
- `modules` - backend feature modules using service/repository boundaries.
- `packages/*` - shared auth, database, audit, storage, logger, config, types, and UI packages.
- `docs` - setup and QA documentation.

## Local Setup

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run db:push
npm run seed:bootstrap
npm run dev --workspace @pulse-r24/web
```

Open `http://localhost:3000`.

## Demo Accounts

The bootstrap seed creates:

- `admin@pulse-r24.local` / `SuperSecret123!` - SUPER_ADMIN
- `analyst@pulse-r24.local` / `DemoPass123!` - ANALYST
- `editor@pulse-r24.local` / `DemoPass123!` - EDITOR
- `reviewer@pulse-r24.local` / `DemoPass123!` - FACT_CHECKER
- `publisher@pulse-r24.local` / `DemoPass123!` - PUBLISHER

Override these in `.env` before running `npm run seed:bootstrap`.

## Useful Scripts

```bash
npm run dev --workspace @pulse-r24/web
npm run build --workspace @pulse-r24/web
npm run lint
npm run typecheck
npm run prisma:generate
npm run db:push
npm run seed:workflow
npm run seed:roles
npm run seed:bootstrap
```

## Current Scope

Implemented for demo/testing:

- Dashboard command center
- Report editor and draft workflow
- Evidence library and report evidence management
- Review queue and assigned reviews
- Workflow history
- Notifications
- Activity feed
- Global search
- Basic analytics

Intentionally not implemented yet:

- AI features
- OSINT automation
- RSS ingestion
- BullMQ workers
- Realtime websockets
- Vector database
- Semantic search
- Threat correlation

See [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) for end-to-end test coverage.
