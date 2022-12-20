import { z } from 'zod'
import { getSession, type SolidAuthConfig } from '@solid-auth/next'
import Github from '@auth/core/providers/github'
import { serverEnv } from './server'
import { type Adapter as AuthCoreAdapter } from '@auth/core/adapters'
import { PrismaAdapter } from '~/server/prisma-auth-adapter'
import { prisma } from '~/server/db/client'
import { randomBytes } from 'node:crypto'
import { type Prisma } from '@prisma/client'

const github = Github({
  clientId: serverEnv.GITHUB_CLIENT_ID,
  clientSecret: serverEnv.GITHUB_CLIENT_SECRET,

  async profile(profile, tokens) {
    const email = await findGithubEMail(tokens.access_token)
    const user: Prisma.UserCreateInput & { id: string } = {
      id: `${profile.id}`,
      name: profile.name ?? profile.login,
      email: profile.email ?? email?.email ?? `github:${profile.id}`,
      emailVerified: email?.verified ? new Date() : null,
      image: profile.avatar_url,
    }
    return user
  },
})

export const solidAuthConfig: SolidAuthConfig = {
  secret: serverEnv.AUTH_SECRET,
  providers: [github],
  debug: false,
  adapter: PrismaAdapter(prisma) as AuthCoreAdapter,
  session: {
    generateSessionToken: () => randomBytes(256).toString('hex'),
  },
}

export const session = (request: Request) => getSession(request, solidAuthConfig)

/**
 * Helper function that retrieves the email address of a github user by access token
 */
const findGithubEMail = async (accessToken?: string) => {
  if (!accessToken) return
  const res = await fetch('https://api.github.com/user/public_emails', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${accessToken}`,
    },
  })

  if (!res.ok) return

  const data = await res.json()

  const emails: GitHubEmail[] = z
    .array(z.any())
    .transform((as) => as.filter((a) => githubEmailEntry.safeParse(a).success))
    .parse(data)

  return emails.find((email) => email.primary) ?? emails.find((email) => email.verified) ?? emails[0]
}

// Github e-mail address object validators
const githubEmailEntry = z.object({
  email: z.string(),
  primary: z.boolean(),
  verified: z.boolean(),
  visibility: z.string().nullable().optional(),
})
type GitHubEmail = z.infer<typeof githubEmailEntry>
