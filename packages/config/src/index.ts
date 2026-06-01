import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(10),
  NEXTAUTH_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  ADMIN_EMAIL: z.string().email().default('admin@pulse-r24.local'),
  ADMIN_PASSWORD: z.string().min(8).default('SuperSecret123!'),
  ADMIN_NAME: z.string().default('Super Admin'),
  DEMO_PASSWORD: z.string().min(8).default('DemoPass123!'),
  DEMO_ANALYST_EMAIL: z.string().email().default('analyst@pulse-r24.local'),
  DEMO_EDITOR_EMAIL: z.string().email().default('editor@pulse-r24.local'),
  DEMO_REVIEWER_EMAIL: z.string().email().default('reviewer@pulse-r24.local'),
  DEMO_PUBLISHER_EMAIL: z.string().email().default('publisher@pulse-r24.local'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.string().optional()
})

const _parsed = envSchema.safeParse(process.env)
if (!_parsed.success) {
  throw new Error(
    'Invalid environment: ' + JSON.stringify(_parsed.error.format(), null, 2)
  )
}

export const env = _parsed.data

export type Env = typeof env

export function getConfig() {
  return env
}

export default getConfig()
