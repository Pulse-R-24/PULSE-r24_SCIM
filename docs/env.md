# Environment Variables

This project currently targets local/demo QA with the SQLite Prisma schema in `packages/database/prisma/schema.prisma`.

Required for local demo:

- `DATABASE_URL` - Prisma database URL. Use `file:./dev.db` for local SQLite.
- `AUTH_SECRET` - Auth.js secret for sessions/JWT signing. Use a long random value outside local demos.

Optional local/demo seed values:

- `ADMIN_EMAIL` - SUPER_ADMIN seed account email. Default: `admin@pulse-r24.local`.
- `ADMIN_PASSWORD` - SUPER_ADMIN seed account password. Default: `SuperSecret123!`.
- `ADMIN_NAME` - SUPER_ADMIN display name. Default: `Super Admin`.
- `DEMO_PASSWORD` - shared demo password for non-admin demo users. Default: `DemoPass123!`.
- `DEMO_ANALYST_EMAIL` - demo analyst account. Default: `analyst@pulse-r24.local`.
- `DEMO_EDITOR_EMAIL` - demo editor account. Default: `editor@pulse-r24.local`.
- `DEMO_REVIEWER_EMAIL` - demo reviewer account. Default: `reviewer@pulse-r24.local`.
- `DEMO_PUBLISHER_EMAIL` - demo publisher account. Default: `publisher@pulse-r24.local`.

Optional integrations:

- `DIRECT_URL` - optional direct database URL for hosted Prisma deployments.
- `SUPABASE_URL` - optional Supabase project URL.
- `SUPABASE_ANON_KEY` - optional Supabase anon key.
- `SUPABASE_SERVICE_ROLE_KEY` - optional Supabase service role key.
- `RESEND_API_KEY` - optional email API key. Email delivery is not implemented in the current phase.
- `REDIS_URL` - Redis URL reserved for later worker phases. Default: `redis://127.0.0.1:6379`.
- `GROQ_API_KEY` - reserved for future AI features. Do not configure for this phase.
- `GEMINI_API_KEY` - reserved for future AI features. Do not configure for this phase.
- `NODE_ENV` - `development`, `production`, or `test`.
- `LOG_LEVEL` - logger level such as `debug`, `info`, `warn`, or `error`.

Security notes:

- Never commit real secrets.
- Rotate demo passwords before sharing an environment outside local testing.
- Keep AI/OSINT/RSS/worker credentials empty until those phases are intentionally implemented.
