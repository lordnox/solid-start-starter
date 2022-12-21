import { APIEvent } from 'solid-start'
import { createSolidAPIHandler } from 'solid-start-trpc'
import { createContext } from '~/server/trpc/context'
import { appRouter } from '~/server/trpc/router/_app'

const handler = createSolidAPIHandler({
  router: appRouter,
  createContext,
})

export const GET = (event: APIEvent) => {
  console.log(event.request.url)
  return {}
}
export const POST = handler
