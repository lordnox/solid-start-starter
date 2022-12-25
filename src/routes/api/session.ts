import { ApiHandler } from 'solid-start/api/types'
import { sessionFromRequest } from '~/env/solid-auth.config'

export const GET: ApiHandler = async (event) => new Response(JSON.stringify(await sessionFromRequest(event.request)))
