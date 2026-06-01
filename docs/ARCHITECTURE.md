# Architecture

PULSE-R24 RC1 is a modular intelligence report management platform.

## High-Level Layout

- `apps/web` - Next.js 15 App Router application.
- `modules` - feature modules containing service and repository code.
- `packages/auth` - session, role, and permission helpers.
- `packages/database` - Prisma client and schema.
- `packages/audit` - compliance audit logging.
- `packages/storage` - upload/storage validation helpers.
- `packages/config` - environment validation.
- `packages/logger`, `packages/types`, `packages/ui` - shared utilities.

## Request Flow

The platform follows:

```text
UI component
→ API route
→ module service
→ module repository
→ Prisma/database
```

Rules:

- UI does not call Prisma directly.
- API routes do not call Prisma directly.
- Business logic belongs in services.
- Database access belongs in repositories.
- Zod validates API inputs and client responses where applicable.
- RBAC checks happen before privileged actions.

## Core Domains

Reports:

- Create and edit reports.
- Save drafts.
- Submit for review.
- Publish/archive through workflow actions.

Workflow:

- Tracks lifecycle events in `WorkflowHistory`.
- Supports draft, review, changes requested, approved, published, and archived states.
- Completes active review assignments when reviewers approve, reject, or request changes.

Evidence:

- Supports URL evidence and file upload metadata.
- Links evidence to reports.
- Validates uploaded file MIME, magic bytes, and size.

Notifications:

- In-app notifications scoped to the logged-in user.
- Used for review assignments and workflow events.

Activity Feed:

- User-facing operational activity stream.
- Separate from audit logs.

Search:

- Keyword/filter search across reports, evidence, workflow history, and activity feed.
- No semantic or vector search in RC1.

Analytics:

- Basic operational aggregations over real database records.
- No predictive analytics.

## Security Boundaries

- Dashboard routes require authentication.
- API routes enforce session checks and permissions.
- Notifications are always scoped by `session.user.id`.
- Audit logs are for compliance, activity feed is for user visibility.

## Out Of Scope In RC1

- AI features
- OSINT automation
- RSS ingestion
- BullMQ workers
- Realtime websockets
- Vector databases
- Semantic search
- Threat correlation
