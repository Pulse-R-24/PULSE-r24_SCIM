# PULSE-r24_SCIM v1.1.0-rc1 Release Report

## Release Identity

- Release: Public-first RC release candidate
- Release tag: `v1.1.0-rc1`
- Previous validated runtime tag: `v1.0.1-rc1`
- Branch: `main`
- Repository: `https://github.com/Pulse-R-24/PULSE-r24_SCIM.git`
- Feature status: frozen for release validation

## Release Summary

`v1.1.0-rc1` adds the public-first PULSE-R24 news and intelligence website layer on top of the previously validated private workflow platform.

The main site now begins at `/` as a public PULSE-R24 reader experience. The staff dashboard remains protected under `/dashboard` and is used by analysts, editors, reviewers, publishers, and admins.

## Completed Modules

Public website:

- Public PULSE-R24 homepage
- Public news listing
- Public article detail page
- Public category listing
- Public latest page
- Public-only search page
- Public navbar, footer, hero, ticker, issue header, article cards, article detail layout, and threat-map inspired visual section
- Public-safe report DTO layer
- Public visibility guardrail tests

Private platform:

- Dashboard command center
- Report editor and draft workflow
- Evidence library
- Report evidence management
- Review queue
- Assigned reviews
- Workflow history
- Notifications
- Activity feed
- Global private search and filters
- Basic analytics
- RBAC helpers and permissions
- Audit/activity logging integration
- Seed scripts for workflow states, roles, permissions, and demo users
- CI/CD validation workflow
- Docker production deployment assets
- RC contract tests
- QA, architecture, deployment, security, testing, and user documentation

## Public Routes Implemented

- `/`
- `/news`
- `/news/[slug]`
- `/category/[slug]`
- `/latest`
- `/public-search`

## Private Routes Retained

- `/auth/signin`
- `/dashboard`
- `/dashboard/reports/new`
- `/dashboard/reports/[id]/edit`
- `/dashboard/evidence`
- `/dashboard/review-queue`
- `/dashboard/assigned-reviews`
- `/dashboard/workflow-history`
- `/dashboard/notifications`
- `/dashboard/activity`
- `/dashboard/search`
- `/dashboard/analytics`

## Architecture Summary

The application continues to follow the established architecture:

```text
Next.js UI
-> API route or server route component
-> module service
-> module repository
-> Prisma/database
```

Core principles preserved:

- Public pages use public-safe report service functions.
- No direct Prisma access from UI.
- No direct Prisma access from API route handlers.
- Business logic lives in services.
- Database access lives in repositories.
- Zod is used for validation.
- RBAC protects private workflow actions.
- Audit logs are separate from user-facing activity feed.
- Public pages do not expose private evidence, workflow notes, review assignments, audit logs, activity metadata, notifications, or internal user IDs.

## Public Visibility Rules

Public pages show only reports where workflow status is `PUBLISHED` and `deleted_at` is null.

Public pages hide:

- `DRAFT`
- `UNDER_REVIEW`
- `CHANGES_REQUESTED`
- `APPROVED`
- `REJECTED`
- `ARCHIVED`
- soft-deleted reports

Private evidence and Supabase Storage paths do not appear on public pages.

## Demo Roles And Accounts

- `admin@pulse-r24.local` / `SuperSecret123!` - SUPER_ADMIN
- `analyst@pulse-r24.local` / `DemoPass123!` - ANALYST
- `editor@pulse-r24.local` / `DemoPass123!` - EDITOR
- `reviewer@pulse-r24.local` / `DemoPass123!` - FACT_CHECKER
- `publisher@pulse-r24.local` / `DemoPass123!` - PUBLISHER

## Validation Results

Static validation passed for the public-first implementation:

- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm test` - passed
- `npm run build --workspace @pulse-r24/web` - passed

Public runtime smoke validation passed:

- `/` loads without login.
- `/news` loads without login.
- `/latest` loads without login.
- `/public-search` loads without login.
- `/auth/signin` loads separately.
- Unauthenticated `/dashboard` redirects and remains protected.

Workflow visibility smoke validation passed:

- Analyst created a smoke report.
- `DRAFT` report returned `404` publicly.
- `UNDER_REVIEW` report returned `404` publicly.
- `APPROVED` report returned `404` publicly.
- Publisher published the report.
- `PUBLISHED` report returned `200` publicly.
- Public search found the published report.
- Publisher archived the report.
- `ARCHIVED` report returned `404` publicly.

Validated public smoke report:

- Report ID: `290a8803-0d39-48c7-b0c4-55f0bf8fbd67`
- Slug: `public-portal-smoke-20260602095914-1780374555817`
- Final status: `ARCHIVED`

Previous RC1 runtime validation reference:

- Title: `RC1 Runtime Validation Report 20260601162458`
- Report ID: `2ded181a-cf7f-4361-af18-d1b9119ac886`
- Final status: `ARCHIVED`
- Workflow history records: `7`
- Evidence records: `2`
- Notifications returned.
- Activity feed returned.
- Search returned.
- Analytics returned.

## Environment Notes

- Supabase PostgreSQL is used for the release database.
- Supabase Storage private bucket `evidence` is used for evidence uploads.
- `DATABASE_URL` uses Supabase pool settings for local validation:
  - `connection_limit=1`
  - `pool_timeout=20`
- `.env` and `.env.production` are ignored and must never be committed.
- The Supabase service role key is required only server-side for signed evidence upload and validation.

## Deployment Readiness Assessment

`v1.1.0-rc1` is ready for:

- Stakeholder demonstration
- Manual public website visual review
- Screenshot capture
- Deployment testing
- Internal workflow QA
- Architecture review
- Controlled pilot testing with demo data

Remaining before production internet exposure:

- Docker validation should be rerun on a machine with sufficient RAM or in CI/CD.
- Rate limiting should be added at the reverse proxy and/or application layer.
- External monitoring and error reporting should be connected.
- Backup and restore should be tested in the hosted Supabase environment.
- CI deployment target still needs to be connected.
- Manual visual review and screenshot capture should be completed for both public and private surfaces.

## Known Limitations

- No AI features
- No OSINT automation
- No RSS ingestion
- No BullMQ worker processing
- No semantic search
- No vector database
- No realtime websockets
- No threat correlation
- No email/SMS/push notifications
- No predictive analytics
- Public ticker uses published reports only, not live external feeds
- Public threat-map inspired section is visual/report-based only, not automated threat correlation
- Search is keyword/filter based
- Analytics are simple operational aggregations

## Git Hygiene Status

- `.env` is ignored.
- `.env.production` is ignored.
- `node_modules` is ignored.
- `.next` is ignored.
- logs are ignored.
- `*.tsbuildinfo` files are ignored.
- local database files are ignored.
- `packages/database/prisma/dev.db` has been removed from tracking for RC1.

## Recommended Branching Strategy

```text
main
-> stable release-candidate baseline

develop
-> future improvements

feature/*
-> isolated feature work
```

Future AI/OSINT work must be developed in separate feature branches and must not modify the release baseline until fully tested.

## Release Tag Verification

Target tag:

```text
v1.1.0-rc1
```

Remote verification:

```bash
git ls-remote --tags origin v1.1.0-rc1
```

## v1.1.3-rc1 Map Verification Addendum

Final public map runtime verification passed for the Protomaps/MapLibre India map.

Validated configuration:

- Supabase PMTiles URL works:
  `https://wrszjsgneolpkcgldngi.supabase.co/storage/v1/object/public/maps/india_z7.pmtiles`
- Real India Protomaps map renders on the public homepage.
- `8` Tier-1 city markers render.
- Marker popup works on desktop.
- Mobile bottom sheet works.
- No React hydration warnings were observed.
- No console errors were observed.
- Public homepage still loads.
- Dashboard login and dashboard landing page still work.

Screenshots captured at:

```text
C:\tmp\pulse-final-protomaps-map-check
```

Final map-verified release tag:

```text
v1.1.3-rc1
```

## v1.1.4-rc1 PMTiles Env Loading Addendum

The PMTiles environment-loading issue was fixed and revalidated.

Validated results:

- Root `.env` is loaded for the `@pulse-r24/web` workspace.
- `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL` resolves without manually exporting it before `npm run dev`.
- Real India Protomaps map renders from the Supabase PMTiles URL.
- `8` Tier-1 city markers render.
- Marker popup works on desktop.
- Mobile map renders.
- Mobile bottom sheet works.
- Fallback appears only when the PMTiles URL is missing or blank.
- No React hydration warnings were observed.
- No console errors were observed.

Final screenshots captured at:

```text
C:\tmp\pulse-v1.1.4-protomaps-final
```

Final PMTiles env-loading release tag:

```text
v1.1.4-rc1
```
