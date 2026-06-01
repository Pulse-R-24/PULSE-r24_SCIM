# RC1 Release Report

## Release Identity

- Release: RC1 validated runtime release
- Final validated tag: `v1.0.1-rc1`
- Commit: `8e646b1e07a4bb295024fbf70f934ba9a7285965`
- Branch: `main`
- Repository: `https://github.com/Pulse-R-24/PULSE-r24_SCIM.git`
- Feature status: frozen

## Completed Modules

- Dashboard command center
- Report editor and draft workflow
- Evidence library
- Report evidence management
- Review queue
- Assigned reviews
- Workflow history
- Notifications
- Activity feed
- Global search and filters
- Basic analytics
- RBAC helpers and permissions
- Audit/activity logging integration
- Seed scripts for workflow states, roles, permissions, and demo users
- CI/CD validation workflow
- Docker production deployment assets
- RC contract tests
- QA, architecture, deployment, security, testing, and user documentation

## Architecture Summary

The application follows a modular architecture:

```text
Next.js UI
-> API route
-> module service
-> module repository
-> Prisma/database
```

Core principles:

- No direct Prisma access from UI.
- No direct Prisma access from API routes.
- Business logic lives in services.
- Database access lives in repositories.
- Zod is used for validation.
- RBAC protects privileged actions.
- Audit logs are separate from user-facing activity feed.

## Demo Roles And Accounts

- `admin@pulse-r24.local` / `SuperSecret123!` - SUPER_ADMIN
- `analyst@pulse-r24.local` / `DemoPass123!` - ANALYST
- `editor@pulse-r24.local` / `DemoPass123!` - EDITOR
- `reviewer@pulse-r24.local` / `DemoPass123!` - FACT_CHECKER
- `publisher@pulse-r24.local` / `DemoPass123!` - PUBLISHER

## Validation Results

Static validation passed:

- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm test` - passed
- `npm run build --workspace @pulse-r24/web` - passed

Runtime validation passed:

- `/api/auth/csrf` returns JSON.
- `/auth/signin` loads.
- Demo users can log in.
- Dashboard loads.
- Reports load.
- Evidence loads.
- Notifications load.
- Activity feed loads.
- Search loads.
- Analytics loads.

Workflow validation passed:

- Analyst created report.
- Draft saved.
- URL evidence attached.
- PNG evidence uploaded to Supabase Storage.
- Report submitted for review.
- Reviewer opened assigned review.
- Reviewer requested changes.
- Analyst resubmitted.
- Reviewer approved.
- Publisher published.
- Publisher archived.

Validated report:

- Title: `RC1 Runtime Validation Report 20260601162458`
- Report ID: `2ded181a-cf7f-4361-af18-d1b9119ac886`
- Final status: `ARCHIVED`

Verified runtime records:

- Workflow history records: `7`
- Evidence records: `2`
- Notifications returned.
- Activity feed returned.
- Search returned.
- Analytics returned.

## Environment Notes

- Supabase PostgreSQL is used for the RC1 database.
- Supabase Storage private bucket `evidence` is used for evidence uploads.
- `DATABASE_URL` uses Supabase pool settings for local validation:
  - `connection_limit=1`
  - `pool_timeout=20`
- `.env` and `.env.production` are ignored and must never be committed.
- The Supabase service role key is required only server-side for signed evidence upload and validation.

## Deployment Readiness Assessment

RC1 is ready for:

- Stakeholder demonstration
- Internal workflow QA
- Architecture review
- Local deployment testing
- Controlled pilot testing with demo data

Remaining before production internet exposure:

- Docker validation should be rerun on a machine with sufficient RAM or in CI/CD.
- Rate limiting should be added at the reverse proxy and/or application layer.
- External monitoring and error reporting should be connected.
- Backup and restore should be tested in the hosted Supabase environment.
- CI deployment target still needs to be connected.

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
-> stable RC1 baseline

develop
-> future improvements

feature/*
-> isolated feature work
```

Future AI/OSINT work must be developed in separate feature branches and must not modify the RC1 baseline until fully tested.

## Release Tag Verification

Target tag:

```text
v1.0.1-rc1
```

Remote verification:

```bash
git ls-remote --tags origin v1.0.1-rc1
```

Expected commit:

```text
8e646b1e07a4bb295024fbf70f934ba9a7285965
```
