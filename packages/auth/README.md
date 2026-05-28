# @pulse-r24/auth

Central Auth.js v5 integration helpers for the PULSE-R24 monorepo. This package centralizes:

- Prisma adapter wiring
- auth route handlers
- server session retrieval
- RBAC helpers and permission checks
- bootstrapped SUPER_ADMIN seeding support

Quick notes

- `getPrismaAdapter()` returns a Prisma adapter wired to the shared database client.
- `authHandler(request)` routes auth requests through Auth.js.
- `getServerSessionFromRequest(req)` and `getServerSessionFromHeaders(headers)` support Next.js server-side session checks.
- `hasRole`, `hasAnyRole`, and `hasPermission` provide centralized RBAC helpers.

Example auth route (Next.js):

```ts
import { NextRequest } from 'next/server'
import { authHandler } from '@pulse-r24/auth'

export async function GET(req: NextRequest) {
  return authHandler(req)
}

export async function POST(req: NextRequest) {
  return authHandler(req)
}
```

Bootstrap SUPER_ADMIN:

```bash
pnpm seed:bootstrap
```

