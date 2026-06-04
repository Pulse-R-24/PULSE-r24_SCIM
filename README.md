# PULSE-R24 Monorepo

Clean rebuild of the PULSE-R24 intelligence report management and public news/intelligence platform.

Current release candidate: `v1.1.4-rc1`.

## Product Structure

Public website:

- `/` - public PULSE-R24 homepage
- `/news` - published report listing
- `/news/[slug]` - public article/report detail
- `/category/[slug]` - published reports by category
- `/latest` - latest published reports
- `/public-search` - public-only search

Private dashboard:

- `/auth/signin` - staff login
- `/dashboard` - protected command center
- `/dashboard/reports/new` - create report
- `/dashboard/reports/[id]/edit` - edit report
- `/dashboard/evidence` - evidence library
- `/dashboard/review-queue` - review queue
- `/dashboard/assigned-reviews` - assigned reviews
- `/dashboard/workflow-history` - lifecycle history
- `/dashboard/notifications` - notifications
- `/dashboard/activity` - activity feed
- `/dashboard/search` - private global search
- `/dashboard/analytics` - basic analytics

## Layout

- `apps/web` - Next.js 15 public website and private dashboard application.
- `apps/worker` - reserved worker app, not required for the current demo workflow.
- `modules` - backend feature modules using service/repository boundaries.
- `packages/*` - shared auth, database, audit, storage, logger, config, types, and UI packages.
- `docs` - setup, QA, release, deployment, and demo documentation.

## Local Setup

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run db:push
npm run seed:bootstrap
npx playwright install chromium
npm run dev --workspace @pulse-r24/web
```

Open `http://localhost:3000` for the public PULSE-R24 website.

Open `http://localhost:3000/auth/signin` for staff login.

For the public India map, set `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL` to the public Supabase Storage PMTiles URL before starting the web app. The validated RC baseline uses the public `maps` bucket and `india_z7.pmtiles`.

## Public Visibility Rules

Public pages show only reports with workflow status `PUBLISHED` and no soft-delete timestamp.

Public pages hide:

- `DRAFT`
- `UNDER_REVIEW`
- `CHANGES_REQUESTED`
- `APPROVED`
- `REJECTED`
- `ARCHIVED`
- soft-deleted reports

Private evidence, workflow comments, review assignments, audit logs, notifications, activity metadata, and internal user IDs are not exposed publicly.

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
npm test
npm run test:e2e
npm run test:e2e:ui
npm run prisma:generate
npm run db:push
npm run seed:workflow
npm run seed:roles
npm run seed:bootstrap
```

## Current Scope

Implemented for demo/testing:

- Public PULSE-R24 news/intelligence portal
- Real Protomaps/MapLibre India homepage map backed by Supabase-hosted PMTiles
- Public published-report browsing, latest page, category pages, and public search
- Dashboard command center
- Report editor and draft workflow
- Evidence library and report evidence management
- Review queue and assigned reviews
- Workflow history
- Notifications
- Activity feed
- Private global search
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

## Release, Deployment, And Demo Handoff

- [Release report](docs/RC1_RELEASE_REPORT.md)
- [Production gaps](docs/PRODUCTION_GAPS.md)
- [Deployment checklist](docs/DEPLOYMENT_CHECKLIST.md)
- [Demo checklist](docs/DEMO_CHECKLIST.md)
- [Screenshot checklist](docs/SCREENSHOT_CHECKLIST.md)