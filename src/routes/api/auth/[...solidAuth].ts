import { SolidAuth } from '@solid-auth/next'
import { solidAuthConfig } from '~/env/solid-auth.config'

export const { GET, POST } = SolidAuth(solidAuthConfig)
