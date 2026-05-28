# Developer Onboarding

Steps to get started locally:

1. Install pnpm (https://pnpm.io/installation)

```bash
pnpm install -g pnpm
```

2. Install dependencies

```bash
pnpm install
```

3. Copy environment files and set secrets

```bash
cp .env.example .env
# and per-package .env.example as needed
```

4. Generate Prisma client

```bash
pnpm --filter @pulse-r24/database prisma generate
```

5. Run the development workspace

```bash
pnpm dev
```

Key places to look

- `packages/database/prisma` — DB models and migrations
- `apps/web/app` — Next.js app route/ui
- `apps/worker/src` — job processors and workers
- `packages/ui/src` — reusable UI primitives
