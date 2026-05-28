# Environment Variables

This document lists the environment variables required to run the PULSE-R24 platform.

- `DATABASE_URL` — Supabase/Postgres connection string (required)
- `DIRECT_URL` — Optional direct DB URL used by Prisma (optional)
- `AUTH_SECRET` — Secret for Auth.js sessions and JWT signing (required)
- `SUPABASE_URL` — Supabase project URL (optional)
- `SUPABASE_ANON_KEY` — Supabase anon key (optional)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (required for server operations)
- `REDIS_URL` — Redis connection string for BullMQ (default: `redis://127.0.0.1:6379`)
- `RESEND_API_KEY` — Resend email API key (optional)
- `GROQ_API_KEY` — GROQ/record-search API key (optional)
- `GEMINI_API_KEY` — LLM API key for AI features (optional)
- `ADMIN_EMAIL` — bootstrap SUPER_ADMIN email (optional default provided)
- `ADMIN_PASSWORD` — bootstrap SUPER_ADMIN password (optional default provided)
- `ADMIN_NAME` — bootstrap SUPER_ADMIN display name
- `NODE_ENV` — `development|production|test` (default: development)
- `LOG_LEVEL` — Pino log level (debug, info, warn, error)

Security notes:

- Never commit real secrets to source control. Use secret stores or CI secrets.
- Use environment-specific service roles for server-side operations (e.g., Supabase service role key).
