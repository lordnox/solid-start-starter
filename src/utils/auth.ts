import { createCookieSessionStorage } from 'solid-start'
import { createSolidAuthClient } from '@solid-auth/core'

import { clientEnv } from '~/env/client' // type safed process.env, doesn't really matter

// Create the Solid Auth Client So You Can Actually Manage The User From The Client Side
export const authClient = createSolidAuthClient(`${clientEnv.START_BASE_URL}/api/auth`)

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    secrets: ['your-secret'],
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
  },
})
