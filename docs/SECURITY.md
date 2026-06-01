# Security Review

RC1 focuses on stable demo/testing hardening. This document records current controls and remaining production recommendations.

## Authentication

- Dashboard routes are protected by middleware.
- API routes check server-side sessions before privileged operations.
- Unauthenticated users receive `401` responses for APIs and are redirected for dashboard pages.

## RBAC

- Roles and permissions are centralized in `packages/auth/src/rbac.ts`.
- Workflow APIs enforce action-specific permissions.
- Report and evidence APIs enforce view/edit/upload permissions.
- Notifications are scoped to `session.user.id`.

## API Authorization

Reviewed API areas:

- Reports
- Evidence
- Workflow actions
- Notifications
- Activity
- Search
- Analytics
- Uploads

Route pattern:

```text
get session
→ require permission
→ parse/validate input
→ call service
```

## Input Validation

- Zod validates core report, workflow, upload, search, analytics, and client response contracts.
- API routes reject invalid query/body shapes where schemas are present.

## File Upload Validation

Upload registration validates:

- Signed upload request shape.
- Upload completion request shape.
- MIME type.
- Magic bytes via `file-type`.
- File size match.

Allowed RC1 MIME families:

- PNG/JPEG/WebP images
- PDF documents

## Security Headers

The web app sets:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Environment Handling

- Required environment variables are validated in `packages/config`.
- `.env` and `.env.production` are ignored by git.
- `.env.example` documents demo-safe defaults.

## Rate Limiting

Rate limiting is not implemented in RC1.

Recommended before public internet exposure:

- Add reverse-proxy rate limiting for `/api/auth`, `/api/uploads`, and workflow mutation routes.
- Add application-level request throttling for authenticated write endpoints.
- Add upload size limits at the proxy and storage layers.

## Production Recommendations

- Rotate all demo passwords.
- Use a long random `AUTH_SECRET`.
- Use provider-managed database backups.
- Put the app behind HTTPS.
- Add request logging and alerting.
- Add rate limiting before public deployment.
- Review storage bucket policies before enabling file upload in production.
