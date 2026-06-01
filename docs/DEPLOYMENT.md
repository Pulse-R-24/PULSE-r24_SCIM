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
DATABASE_URL="file:/data/prod.db"
AUTH_SECRET="replace_with_a_long_random_secret"
NODE_ENV="production"
LOG_LEVEL="info"
```

For hosted databases, set `DATABASE_URL` to the provider connection string and update backup steps accordingly.

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

For SQLite demo deployment:

```bash
npm run db:push
npm run seed:bootstrap
```

For container deployment, the RC1 compose service prepares and seeds the configured database on startup. For stricter production environments, run the same setup commands as a one-time deployment job before starting the web service.

## Backup Strategy

SQLite demo deployments:

1. Stop writes or pause the app.
2. Copy the database file from the mounted volume.
3. Store backups with timestamped filenames.
4. Keep at least daily backups during demos.

Example:

```bash
docker compose -f docker-compose.production.yml stop web
docker run --rm -v pulse-r24_scim_pulse_r24_data:/data -v %cd%:/backup alpine cp /data/prod.db /backup/prod-backup.db
docker compose -f docker-compose.production.yml start web
```

Hosted database deployments:

- Use provider-managed automated backups.
- Enable point-in-time restore when available.
- Export a manual backup before every demo or migration.

## Restore Procedure

SQLite demo deployments:

1. Stop the app.
2. Replace `/data/prod.db` with the selected backup file.
3. Start the app.
4. Run smoke checks: login, dashboard, report list, search, analytics.

Hosted database deployments:

1. Restore via provider backup tooling.
2. Verify schema compatibility.
3. Run smoke checks.

## Release Checklist

Use `docs/RELEASE_CANDIDATE_CHECKLIST.md` before tagging RC1.
