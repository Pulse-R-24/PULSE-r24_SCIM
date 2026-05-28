import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(10),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  RESEND_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
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
