export declare type Awaitable<T> = T | PromiseLike<T>
export interface DefaultUser {}

export declare type ProviderType = 'oauth' | 'email' | 'credentials'

export interface TokenSet {
  access_token?: string
  token_type?: string
  id_token?: string
  refresh_token?: string
  scope?: string

  expires_at?: number
  session_state?: string

  [key: string]: unknown
}

export interface Account extends Partial<TokenSet> {
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string
  /** id of the user this account belongs to. */
  userId?: string
  /** id of the provider used for this account */
  provider: string
  /** Provider's type for this account */
  type: ProviderType
}

export interface AdapterUser extends DefaultUser {
  id: string
  email: string | null
  emailVerified: Date | null
}

export interface AdapterAccount extends Account {
  userId: string
}

export interface AdapterSession {
  /** A randomly generated value that is used to get hold of the session. */
  sessionToken: string
  /** Used to connect the session to a particular user */
  userId: string
  expires: Date
}

export interface VerificationToken {
  identifier: string
  expires: Date
  token: string
}

export interface DefaultAdapter {
  createUser: (user: Omit<AdapterUser, 'id'>) => Awaitable<AdapterUser>
  getUser: (id: string) => Awaitable<AdapterUser | null>
  getUserByEmail: (email: string) => Awaitable<AdapterUser | null>
  /** Using the provider id and the id of the user for a specific account, get the user. */
  getUserByAccount: (
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ) => Awaitable<AdapterUser | null>
  updateUser: (user: Partial<AdapterUser>) => Awaitable<AdapterUser>
  /** @todo Implement */
  deleteUser?: (userId: string) => Promise<void> | Awaitable<AdapterUser | null | undefined>
  linkAccount: (account: AdapterAccount) => Promise<void> | Awaitable<AdapterAccount | null | undefined>
  /** @todo Implement */
  unlinkAccount?: (
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ) => Promise<void> | Awaitable<AdapterAccount | undefined>
  /** Creates a session for the user and returns it. */
  createSession: (session: { sessionToken: string; userId: string; expires: Date }) => Awaitable<AdapterSession>
  getSessionAndUser: (sessionToken: string) => Awaitable<{
    session: AdapterSession
    user: AdapterUser
  } | null>
  updateSession: (
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) => Awaitable<AdapterSession | null | undefined>
  /**
   * Deletes a session from the database.
   * It is preferred that this method also returns the session
   * that is being deleted for logging purposes.
   */
  deleteSession: (sessionToken: string) => Promise<void> | Awaitable<AdapterSession | null | undefined>
  createVerificationToken?: (verificationToken: VerificationToken) => Awaitable<VerificationToken | null | undefined>
  /**
   * Return verification token from the database
   * and delete it so it cannot be used again.
   */
  useVerificationToken?: (params: { identifier: string; token: string }) => Awaitable<VerificationToken | null>
}

export declare type Adapter = DefaultAdapter
