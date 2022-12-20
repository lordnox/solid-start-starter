import { Adapter, AdapterAccount } from '@auth/core/adapters'
import { type PrismaClient } from '@prisma/client'

/**
 * This internal Adapter does not require the email to be a string but allows null as well.
 * GitHub does not necessarily return an email with their OAuth session
 */
export const PrismaAdapter = (prisma: PrismaClient): Adapter => ({
  createUser: (data) => prisma.user.create({ data }),
  getUser: (id) => prisma.user.findUnique({ where: { id } }),
  getUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  async getUserByAccount(provider_providerAccountId) {
    var _a
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId },
      select: { user: true },
    })
    return (_a = account === null || account === void 0 ? void 0 : account.user) !== null && _a !== void 0 ? _a : null
  },
  updateUser: ({ id, ...data }) => prisma.user.update({ where: { id }, data }),
  deleteUser: (id) => prisma.user.delete({ where: { id } }),
  linkAccount: async (data): Promise<AdapterAccount> => (await prisma.account.create({ data })) as any,
  unlinkAccount: async (provider_providerAccountId) => {
    prisma.account.delete({
      where: { provider_providerAccountId },
    })
  },
  async getSessionAndUser(sessionToken) {
    const userAndSession = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })
    if (!userAndSession) return null
    const { user, ...session } = userAndSession
    return { user, session }
  },
  createSession: (data) => prisma.session.create({ data }),
  updateSession: (data) => prisma.session.update({ where: { sessionToken: data.sessionToken }, data }),
  deleteSession: (sessionToken) => prisma.session.delete({ where: { sessionToken } }),
  createVerificationToken: async (data) => await prisma.verificationToken.create({ data }),
  async useVerificationToken(identifier_token) {
    try {
      const verificationToken = await prisma.verificationToken.delete({
        where: { identifier_token },
      })
      return verificationToken
    } catch (error) {
      // If token already used/deleted, just return null
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if ((error as any)?.code === 'P2025') return null
      throw error
    }
  },
})
