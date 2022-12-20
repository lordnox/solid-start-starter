import { getSession, type SolidAuthConfig } from '@solid-auth/next'
import Github from '@auth/core/providers/github'
import { serverEnv } from './server'
import { PrismaAdapter } from '~/server/prisma-auth-adapter'
import { prisma } from '~/server/db/client'
import { randomBytes } from 'node:crypto'

export const solidAuthConfig: SolidAuthConfig = {
  secret: 'something',
  providers: [
    Github({
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    }),
  ],
  debug: false,
  adapter: PrismaAdapter(prisma),
  session: {
    generateSessionToken: () => randomBytes(256).toString('hex'),
  },
}

export const session = (request: Request) => getSession(request, solidAuthConfig)
