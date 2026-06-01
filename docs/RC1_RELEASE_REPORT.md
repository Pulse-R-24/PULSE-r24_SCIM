# RC1 Release Report

## Release Identity

- Release: RC1
- Version tag: `v1.0.0-rc1`
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

## Verification Results

Local RC validation completed:

- `npm test` - passed
- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm run build --workspace @pulse-r24/web` - passed
- `npm run db:push` - passed
- `npm run seed:bootstrap` - passed
- Demo user/role seed verification - passed
- Workflow state seed verification - passed
- Fresh setup checklist review - passed after adding the tracked root `.env.example` and deterministic `npm run db:push` setup command
- Git hygiene review - passed: `.env`, local databases, `node_modules`, `.next`, logs, and `*.tsbuildinfo` are ignored
- Docker validation - deferred on this local Windows machine because Docker Desktop caused memory pressure. Docker build/compose validation should be rerun on a machine with sufficient RAM or in CI/CD. This is not treated as an RC1 product failure.

Fresh-clone validation from tag `v1.0.0-rc1` at commit `3ed5219d4cc66fb2b04040bdd56783d8bb8a2c2e`:

- `git clone --branch v1.0.0-rc1 --depth 1 https://github.com/Pulse-R-24/PULSE-r24_SCIM.git C:\tmp\pulse-r24-rc1-validation-final` - passed
- `git rev-parse HEAD` - passed, returned `3ed5219d4cc66fb2b04040bdd56783d8bb8a2c2e`
- `git status --short` - passed, clean working tree
- `Test-Path node_modules` - passed, no local dependencies were reused
- `npm ci` - passed, with `npm audit` reporting 8 known vulnerabilities: 2 low, 6 moderate
- `Copy-Item .env.example .env` - passed
- `npm run prisma:generate` - passed
- `npm run db:push` - passed, created fresh SQLite database
- `npm run seed:bootstrap` - passed
- Environment validation for `DATABASE_URL` and `AUTH_SECRET` - passed
- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm test` - passed, 11 tests
- `npm run build --workspace @pulse-r24/web` - passed

Runtime validation result:

- Initial command: `Start-Process -FilePath npm -ArgumentList @('run','start','--workspace','@pulse-r24/web','--','-p','3100')`
- Error: `%1 is not a valid Win32 application.`
- Root cause: Windows `Start-Process` cannot execute the `npm` shim directly in this validation harness.
- Recommended fix: use `npm.cmd` for Windows shell-based runtime validation commands.

Standalone runtime validation result:

- Command: `node apps/web/server.js` from `apps/web/.next/standalone` with `PORT=3100`, `NEXTAUTH_URL=http://127.0.0.1:3100`, `DATABASE_URL` pointed to the fresh SQLite database, and `AUTH_SECRET` set.
- Server startup: passed, Next.js reported ready on `http://127.0.0.1:3100`.
- `/` smoke check: passed with HTTP 200.
- `/auth/signin` smoke check: failed.
- Error output: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`.
- Root cause: the sign-in page requests `/api/auth/csrf`, but the app currently defines `apps/web/src/app/api/auth/route.ts` instead of a catch-all route such as `apps/web/src/app/api/auth/[...nextauth]/route.ts`; `/api/auth/csrf` returns 404 HTML, which the sign-in page attempts to parse as JSON.
- Recommended fix: correct the Auth.js route shape so `/api/auth/csrf` and related auth subroutes resolve, then rerun runtime and workflow validation from a fresh clone.

Workflow validation result:

- Not executed after the runtime authentication failure, following the RC1 validation rule to stop on first real runtime failure.
- Blocked workflow path: login -> dashboard -> report creation/review/publish/archive.
- Recommended fix: resolve the auth route issue, then rerun the full Analyst -> Reviewer -> Publisher validation.

CI/CD validation is configured in `.github/workflows/ci.yml` and fails on:

- dependency install failure
- Prisma generation failure
- database setup failure
- seed failure
- lint failure
- typecheck failure
- test failure
- production build failure

## Deployment Readiness Assessment

RC1 is ready for:

- Code review and stakeholder architecture review
- Setup/build validation review
- Internal QA after the runtime auth route fix
- Fresh-environment setup validation
- Docker deployment testing on a machine/runner with sufficient memory
- Controlled pilot testing with demo data after runtime and workflow validation pass

RC1 requires additional hardening before production internet exposure:

- Runtime auth route fix and revalidation
- Managed Postgres migration
- Production migrations instead of `prisma db push`
- Rate limiting
- Backup/restore rehearsal
- Observability and error monitoring
- Dependency audit remediation
- Storage bucket policy review

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
- File upload requires storage configuration
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
v1.0.0-rc1
```

Remote verification should confirm:

```bash
git ls-remote --tags origin v1.0.0-rc1
```
