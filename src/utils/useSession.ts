import { createServerData$ } from 'solid-start/server'
import { getSession } from '@solid-auth/next'
import { solidAuthConfig } from '~/env/solid-auth.config'

export const serverSession: Parameters<typeof createServerData$> = [
  (_, { request }) => getSession(request, solidAuthConfig),
  { key: () => ['auth_user'] },
]
