# Environment Variables

This project targets the NEW PULSE-r24_SCIM Supabase project for RC1 database and storage configuration.

Do not use the old PLUSE-R24 Supabase database or storage project.

## Required For RC1

- `DATABASE_URL` - Prisma database URL for the NEW PULSE-r24_SCIM Supabase Postgres database. For `npm run db:push` and seed setup, use the direct/session connection string from the new Supabase project.
- `AUTH_SECRET` - Auth.js secret for sessions/JWT signing. Use a long random value outside local demos.
- `NEXTAUTH_URL` - canonical app URL used by the current Auth.js sign-in page when requesting CSRF data. Local default: `http://localhost:3000`. Production example: `https://your-domain.example`.
- `SUPABASE_URL` - NEW PULSE-r24_SCIM Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` - NEW PULSE-r24_SCIM Supabase service role key. Required by the server-side storage client for signed evidence uploads and file validation.

## Optional For RC1

- `DIRECT_URL` - optional direct database URL placeholder for future production Prisma connection separation. The current Prisma schema reads `DATABASE_URL`.
- `SUPABASE_ANON_KEY` - optional Supabase anon key. Current RC1 upload code uses the service role key server-side and does not require the anon key.
- `NODE_ENV` - `development`, `production`, or `test`.
- `LOG_LEVEL` - logger level such as `debug`, `info`, `warn`, or `error`.

## Seed Values

These have safe defaults in `packages/config/src/index.ts`, but can be overridden before running `npm run seed:bootstrap`.

- `ADMIN_EMAIL` - SUPER_ADMIN seed account email. Default: `admin@pulse-r24.local`.
- `ADMIN_PASSWORD` - SUPER_ADMIN seed account password. Default: `SuperSecret123!`.
- `ADMIN_NAME` - SUPER_ADMIN display name. Default: `Super Admin`.
- `DEMO_PASSWORD` - shared demo password for non-admin demo users. Default: `DemoPass123!`.
- `DEMO_ANALYST_EMAIL` - demo analyst account. Default: `analyst@pulse-r24.local`.
- `DEMO_EDITOR_EMAIL` - demo editor account. Default: `editor@pulse-r24.local`.
- `DEMO_REVIEWER_EMAIL` - demo reviewer account. Default: `reviewer@pulse-r24.local`.
- `DEMO_PUBLISHER_EMAIL` - demo publisher account. Default: `publisher@pulse-r24.local`.

## Supabase Database Setup

1. Open the NEW PULSE-r24_SCIM Supabase project.
2. Copy the Postgres connection string for that project.
3. Set `DATABASE_URL` in `.env`.
4. Run:

   ```bash
   npm run prisma:generate
   npm run db:push
   npm run seed:bootstrap
   ```

## Supabase Storage Setup

1. In the NEW PULSE-r24_SCIM Supabase project, create a private storage bucket named `evidence`.
2. Set `SUPABASE_URL`.
3. Set `SUPABASE_SERVICE_ROLE_KEY`.
4. Leave `SUPABASE_ANON_KEY` blank unless later client-side storage features are intentionally added.

The current evidence upload UI hardcodes the bucket name `evidence`; there is no RC1 environment variable for the bucket name.

## Not Used In RC1

Do not configure these for RC1 because the corresponding features are intentionally not implemented:

- AI provider keys
- OSINT provider keys
- RSS ingestion keys
- BullMQ/worker Redis keys
- Email provider keys
- Vector database keys
- Semantic search keys
- Realtime/websocket keys

Security notes:

- Never commit real secrets.
- Rotate demo passwords before sharing an environment outside local testing.
- Use secrets from the NEW PULSE-r24_SCIM Supabase project only.
