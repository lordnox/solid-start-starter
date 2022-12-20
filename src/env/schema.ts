import { isServer } from 'solid-js/web'
import { z } from 'zod'

export const serverScheme = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  AUTH_TRUST_HOST: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  AUTH_SECRET: z.string(),
  DATABASE_URL: z.string(),
  START_BASE_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
})

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  START_BASE_URL: z.string().optional().default('http://127.0.0.1:3000'),
})
