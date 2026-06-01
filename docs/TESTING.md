# Testing Strategy

RC1 uses a mix of automated contract tests and manual QA.

## Automated Tests

Run:

```bash
npm test
```

Current RC contract tests cover:

- RBAC permission contracts.
- Report API authentication/authorization contract.
- Workflow lifecycle service contract.
- Workflow API permission contract.
- Report module service/validator contract.
- Evidence API and upload validation contract.
- Notification scoping contract.
- Search API/domain coverage contract.
- Analytics API/domain coverage contract.

These tests are lightweight and do not require a live database.

## Required Verification Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build --workspace @pulse-r24/web
```

## Manual QA

Use:

- `docs/QA_CHECKLIST.md`
- `docs/RELEASE_CANDIDATE_CHECKLIST.md`

## Recommended Next Tests

Before production launch:

- Database-backed service integration tests.
- API route tests with mocked sessions.
- Browser smoke tests for the full demo workflow.
- Upload tests with a configured storage backend.
- Backup/restore rehearsal tests.
