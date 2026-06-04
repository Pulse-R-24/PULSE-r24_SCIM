# RC1 Deployment Checklist

Release: `PULSE-r24_SCIM v1.1.4-rc1`

Validated tag: `v1.1.4-rc1`

Validated commit: `b552e01ad4cc14be81f8ad2174f83e4aec8faedb`

Repository: `https://github.com/Pulse-R-24/PULSE-r24_SCIM`

## 1. Release Status

- [x] Local RC1 validation completed.
- [x] Remote `main` branch verified.
- [x] Remote tag `v1.1.4-rc1` verified.
- [x] Tag points to validated runtime fix commit: `b552e01ad4cc14be81f8ad2174f83e4aec8faedb`.
- [ ] GitHub Release published for `v1.1.4-rc1`.

## 2. GitHub Release

GitHub Release creation was not completed from this local machine because:

- GitHub CLI `gh` is not installed.
- No `GITHUB_TOKEN` or `GH_TOKEN` is available in the local shell.

This is not a project failure. The remote tag exists and can be published as a GitHub Release from any authenticated GitHub session.

### GitHub UI Steps

1. Open the GitHub repository.
2. Go to `Releases`.
3. Select `Draft a new release`.
4. Choose existing tag `v1.1.4-rc1`.
5. Set release title to `PULSE-r24_SCIM v1.1.4-rc1`.
6. Mark the release as `Pre-release`.
7. Use `docs/RC1_RELEASE_REPORT.md` as the release note source.
8. Publish the release.

### GitHub CLI Steps

Run from an authenticated environment:

```bash
gh release create v1.1.4-rc1 \
  --repo Pulse-R-24/PULSE-r24_SCIM \
  --title "PULSE-r24_SCIM v1.1.4-rc1" \
  --notes-file docs/RC1_RELEASE_REPORT.md \
  --prerelease
```

Verify:

```bash
gh release view v1.1.4-rc1 --repo Pulse-R-24/PULSE-r24_SCIM
```

## 3. Required Environment Variables

Use the NEW PULSE-r24_SCIM Supabase project only. Do not use the old PLUSE-R24 Supabase project.

Required for RC1 runtime:

- `DATABASE_URL` - Supabase PostgreSQL connection string for the NEW project.
- `AUTH_SECRET` - Auth.js session/JWT secret.
- `NEXTAUTH_URL` - canonical app URL, such as `http://localhost:3000` or the production domain.
- `SUPABASE_URL` - Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` - server-side key for private evidence storage operations.
- `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL` - public Supabase Storage URL for the homepage Protomaps India map.

Recommended or optional:

- `DIRECT_URL` - optional direct database connection placeholder for future production migration workflows.
- `SUPABASE_ANON_KEY` - optional in RC1; current upload flow uses the service role key server-side.
- `NODE_ENV` - `production` for deployed environments.
- `LOG_LEVEL` - recommended `info` in production.

Seed overrides:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `DEMO_PASSWORD`
- `DEMO_ANALYST_EMAIL`
- `DEMO_EDITOR_EMAIL`
- `DEMO_REVIEWER_EMAIL`
- `DEMO_PUBLISHER_EMAIL`

Database pool note:

- RC1 validation used Supabase PostgreSQL pool settings with `connection_limit=1` and `pool_timeout=20`.
- Keep conservative pool settings for serverless deployments unless a platform-specific database pooler is configured.

Storage note:

- Supabase Storage private bucket `evidence` must exist before evidence upload testing.
- The bucket name is fixed in RC1 and is not controlled by an environment variable.
- Supabase Storage public bucket `maps` must contain the lightweight PMTiles file, for example `india_z7.pmtiles`, before public map smoke testing.

## 4. Pre-Deployment Validation

Run before deploying a release candidate:

```bash
npm install
npm run prisma:generate
npm run lint
npm run typecheck
npm test
npm run build --workspace @pulse-r24/web
```

For a fresh database:

```bash
npm run db:push
npm run seed:bootstrap
```

Expected result:

- Lint passes.
- Typecheck passes.
- Tests pass.
- Web production build passes.
- Demo accounts are created.
- Supabase Storage bucket `evidence` is available.

## 5. Vercel Deployment

Use this for the fastest stakeholder demo deployment.

### Vercel Project Settings

- Framework preset: `Next.js`
- Repository: `Pulse-R-24/PULSE-r24_SCIM`
- Branch: `main`
- Build command: `npm run build --workspace @pulse-r24/web`
- Install command: `npm ci`
- Output directory: leave default for Next.js
- Node.js version: `20`

### Vercel Environment Variables

Set the RC1 required variables in Vercel project settings:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL`
- `NODE_ENV=production`
- `LOG_LEVEL=info`

Optional:

- `DIRECT_URL`
- `SUPABASE_ANON_KEY`

### Vercel Database Setup

Run database setup once from a trusted local machine or CI job using the same production environment variables:

```bash
npm run prisma:generate
npm run db:push
npm run seed:bootstrap
```

Do not run seed repeatedly against a stakeholder demo database unless the demo reset is intentional.

### Vercel Smoke Checks

- [ ] `https://<domain>/auth/signin` loads.
- [ ] `https://<domain>/api/auth/csrf` returns JSON.
- [ ] Analyst demo user can log in.
- [ ] Dashboard loads.
- [ ] Evidence upload reaches Supabase Storage.

## 6. Railway Deployment

Use Railway when a managed long-running Node service is preferred.

### Railway Service Settings

- Source: GitHub repository.
- Branch: `main`.
- Node.js version: `20`.
- Build command:

```bash
npm ci && npm run prisma:generate && npm run build --workspace @pulse-r24/web
```

- Start command:

```bash
node apps/web/.next/standalone/apps/web/server.js
```

Railway provides `PORT`; the Next.js standalone server should use it automatically.

### Railway Environment Variables

Set:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL`
- `NODE_ENV=production`
- `LOG_LEVEL=info`

Optional:

- `DIRECT_URL`
- `SUPABASE_ANON_KEY`

### Railway Database Setup

Run once as a Railway shell command or one-off job:

```bash
npm run db:push
npm run seed:bootstrap
```

### Railway Smoke Checks

- [ ] Service starts without Prisma or Auth.js errors.
- [ ] `/auth/signin` loads.
- [ ] `/api/auth/csrf` returns JSON.
- [ ] Demo login succeeds.
- [ ] Main dashboard routes load.

## 7. Render Deployment

Use Render for a conventional Node web service deployment.

### Render Web Service Settings

- Runtime: `Node`
- Branch: `main`
- Node.js version: `20`
- Build command:

```bash
npm ci && npm run prisma:generate && npm run build --workspace @pulse-r24/web
```

- Start command:

```bash
node apps/web/.next/standalone/apps/web/server.js
```

### Render Environment Variables

Set:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL`
- `NODE_ENV=production`
- `LOG_LEVEL=info`

Optional:

- `DIRECT_URL`
- `SUPABASE_ANON_KEY`

### Render Database Setup

Run once through Render shell or a one-off job:

```bash
npm run db:push
npm run seed:bootstrap
```

### Render Smoke Checks

- [ ] Web service is healthy.
- [ ] `/auth/signin` loads.
- [ ] `/api/auth/csrf` returns JSON.
- [ ] Demo login succeeds.
- [ ] Evidence upload succeeds.

## 8. Post-Deployment Smoke Test

Use a clean browser session.

- [ ] Login page loads at `/auth/signin`.
- [ ] `/api/auth/csrf` returns JSON.
- [ ] Public homepage renders the real Protomaps India map.
- [ ] Public homepage does not show `Map tiles are not configured`.
- [ ] Eight Tier-1 city markers render.
- [ ] Analyst can log in.
- [ ] Dashboard loads at `/dashboard`.
- [ ] Reports load.
- [ ] Evidence loads.
- [ ] Notifications load.
- [ ] Activity feed loads.
- [ ] Search loads.
- [ ] Analytics loads.
- [ ] Analyst can create a report.
- [ ] Analyst can save a draft.
- [ ] Analyst can attach URL evidence.
- [ ] Analyst can upload PNG evidence to Supabase Storage.
- [ ] Analyst can submit for review.
- [ ] Reviewer can request changes.
- [ ] Analyst can resubmit.
- [ ] Reviewer can approve.
- [ ] Publisher can publish.
- [ ] Publisher can archive.
- [ ] Workflow history updates.
- [ ] Notifications return.
- [ ] Activity feed returns.
- [ ] Search returns the test report.
- [ ] Analytics returns updated data.

## 9. Rollback

Use the stable RC1 tag as the restore point:

```bash
git checkout v1.1.4-rc1
```

For hosted deployments:

1. Redeploy the `v1.1.4-rc1` tag.
2. Restore the Supabase database from the latest known-good backup.
3. Verify `/auth/signin`, `/api/auth/csrf`, and `/dashboard`.

## 10. Deferred Validation

Docker validation remains deferred on the local Windows machine because Docker Desktop caused memory pressure. Re-run Docker build and Compose validation on a machine with sufficient RAM or in CI/CD.

Do not treat this as an RC1 failure.