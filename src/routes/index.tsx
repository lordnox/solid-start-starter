import { A } from 'solid-start'
import Counter from '~/components/Counter'
import { useRouteData } from 'solid-start'
import { signIn, signOut } from '@solid-auth/next/client'
import { serverSession } from '~/utils/useSession'
const login = () => signIn('github')
const logout = () => signOut()

import { createServerData$ } from 'solid-start/server'

export const routeData = () => createServerData$(...serverSession)

export default function Home() {
  const user = useRouteData<typeof routeData>()

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Hello world!</h1>
      <Counter />
      <p class="mt-8">
        Visit{' '}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <span>Home</span>
        {' - '}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{' '}
      </p>
      <br />
      <p>
        <button onClick={() => signIn()}>Login with Any?</button>
      </p>
      <p>
        <button onClick={() => login()}>Login with Github</button>
      </p>
      <p>
        <button onClick={() => logout()}>Logout</button>
      </p>
      <div class="flex flex-col gap-2 items-center">
        <pre>{JSON.stringify(user(), null, 2)}</pre>
      </div>
    </main>
  )
}
