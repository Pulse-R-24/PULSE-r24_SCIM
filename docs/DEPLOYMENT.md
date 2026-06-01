# Deployment Guide

This guide prepares RC1 for stakeholder demo and production-like testing.

## Prerequisites

- Node.js 20
- npm
- Docker and Docker Compose for container deployment
- A configured `.env.production`
- Database storage with backup policy

## Required Environment

Start from `.env.example` and create `.env.production`.

Minimum:

```bash
DATABASE_URL="postgresql://postgres.<new-project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
AUTH_SECRET="replace_with_a_long_random_secret"
NEXTAUTH_URL="https://your-domain.example"
SUPABASE_URL="https://<new-project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="replace_with_new_project_service_role_key"
NODE_ENV="production"
LOG_LEVEL="info"
```

Use the NEW PULSE-r24_SCIM Supabase project only. Do not point RC1 at the old PLUSE-R24 Supabase database or storage project.

## Local Production Build

```bash
npm install
npm run prisma:generate
npm run db:push
npm run lint
npm run typecheck
npm test
npm run build --workspace @pulse-r24/web
```

## Docker Build

```bash
docker build -t pulse-r24-web:rc1 .
```

## Docker Compose Production

```bash
copy .env.example .env.production
docker compose -f docker-compose.production.yml up --build -d
```

The service listens on port `3000`.

The RC1 container startup command runs `npm run db:push` equivalent setup and `npm run seed:bootstrap` equivalent seeding against the configured `DATABASE_URL` before starting Next.js. This keeps demo compose deployments repeatable, but production deployments should replace this with managed migrations before broad rollout.

## Database Preparation

For Supabase database setup:

```bash
npm run db:push
npm run seed:bootstrap
```

For container deployment, the RC1 compose service prepares and seeds the configured database on startup. For stricter production environments, run the same setup commands as a one-time deployment job before starting the web service.

## Backup Strategy

Supabase demo deployments:

- Use Supabase-managed backups where available.
- Export a manual SQL backup before every stakeholder demo or schema change.
- Confirm the backup belongs to the NEW PULSE-r24_SCIM project.

## Restore Procedure

Supabase demo deployments:

1. Restore via Supabase backup tooling or SQL import.
2. Verify schema compatibility.
3. Run smoke checks.

## Release Checklist

Use `docs/RELEASE_CANDIDATE_CHECKLIST.md` before tagging RC1.
