# RC1 Production Gaps

This document captures the production-readiness assessment for RC1. Feature development is frozen; these items are deployment, reliability, security, and operational hardening concerns.

## Current Strengths

- Core intelligence report workflow is implemented end-to-end.
- Route -> service -> repository architecture is in place.
- Dashboard, reports, evidence, review, workflow history, notifications, activity, search, and analytics are implemented.
- RBAC checks protect major workflow actions and sensitive APIs.
- Notifications are scoped to the logged-in user.
- Search and analytics use real system data.
- Seed scripts create workflow states, roles, permissions, and demo accounts.
- CI validates install, Prisma generation, deterministic database setup, seed, lint, typecheck, tests, and production build.
- Docker production assets exist for deployment testing.
- Security headers are configured in Next.js.
- File upload registration validates schema, MIME, magic bytes, and size.
- QA, architecture, deployment, security, testing, and user documentation exist.

## Remaining Risks

- No database migration history is maintained yet; RC1 demo setup uses `npm run db:push`, a deterministic wrapper around `prisma db push`.
- Docker build/compose validation was deferred on the local Windows machine because Docker Desktop caused memory pressure; rerun Docker validation on a machine with sufficient RAM or in CI/CD.
- Rate limiting is not implemented at the application layer.
- File upload size limits are not enforced at every layer.
- No automated browser/e2e test suite exists yet.
- Contract tests validate code paths statically but do not replace database-backed integration tests.
- No production observability stack is configured.
- No centralized error reporting is configured.
- No documented incident response process exists.
- No dependency vulnerability remediation has been completed beyond awareness of `npm audit` output.
- Email/SMS/push notifications are not implemented.
- Backup and restore procedures are documented but not fully rehearsed in this environment.
- CI deployment target still needs to be connected.

## Recommended Production Improvements

- Move production database to managed Postgres.
- Replace `prisma db push` with Prisma migrations for production.
- Add migration runbook and rollback policy.
- Add Docker build and compose smoke validation to CI/CD or a dedicated deployment runner with sufficient memory.
- Add reverse-proxy rate limiting for auth, upload, search, and workflow mutation APIs.
- Add application-level rate limits for authenticated write endpoints.
- Add request logging, structured audit exports, and alerting.
- Add health/readiness endpoints for container orchestration.
- Add database-backed service integration tests.
- Add browser smoke tests for the complete demo workflow.
- Add storage-specific upload limits and antivirus/malware scanning before public file upload.
- Add Sentry or equivalent error monitoring.
- Add dependency scanning in CI.
- Rehearse backup and restore in the hosted Supabase environment before stakeholder demos.
- Connect the CI deployment target and environment secrets.

## Scalability Concerns

- Supabase Postgres is appropriate for the next deployment validation phase, but connection pooling, migration policy, and backup/restore rehearsal still need production review.
- Search is simple relational keyword/filter search and may need indexed query tuning as data grows.
- Analytics are computed from live queries and may require materialized summaries for larger datasets.
- Activity and workflow history can grow quickly and may need pagination/retention policies.
- File metadata and storage lifecycle policies should be defined before large evidence uploads.
- Notification delivery is currently in-app only and not realtime.

## Security Recommendations

- Rotate all demo passwords before any shared deployment.
- Use a long random production `AUTH_SECRET`.
- Enforce HTTPS at the ingress/proxy layer.
- Use secure, provider-managed secrets instead of local `.env` files in production.
- Add rate limiting and lockout controls for authentication.
- Restrict upload buckets by policy and validate access paths.
- Add maximum upload size checks before signed URL issuance and after upload completion.
- Add CSP after confirming asset and image source requirements.
- Review RBAC permissions before onboarding real users.
- Add audit log retention and export policy.
- Run dependency audit and patch moderate/high vulnerabilities before public exposure.

## RC1 Decision

RC1 is suitable for:

- Stakeholder demonstration
- Local deployment testing
- Internal workflow QA
- Architecture review
- Controlled pilot testing with demo data

RC1 is not yet suitable for:

- Public internet exposure without a reverse proxy and rate limits
- Production evidence storage without storage policy review
- High-concurrency multi-user production workloads
- Regulated production use without expanded audit/export/retention controls
