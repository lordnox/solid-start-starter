import { Session } from '@auth/core'
import { createRoot, createSignal } from 'solid-js'

type INITIAL_STATE = { state: 'INITIAL' }
type LOADING_STATE = { state: 'LOADING' }
export type LOADED_STATE = { state: 'LOADED'; data: Session | null; reason?: string }

type STATE = INITIAL_STATE | LOADING_STATE | LOADED_STATE

const [currentSession, setCurrentSession] = createRoot(() =>
  createSignal<STATE>({
    state: 'INITIAL',
  }),
)

export const useSession = () => {
  const session = currentSession()
  if (session.state === 'INITIAL') {
    setCurrentSession({ state: 'LOADING' })
    fetch('/api/session')
      .then(async (response) =>
        setCurrentSession({
          state: 'LOADED',
          data: await response.json(),
        }),
      )
      .catch((e) =>
        setCurrentSession({
          state: 'LOADED',
          data: null,
          reason: e?.toString(),
        }),
      )
  }

  return currentSession
}

export const session = () => (useSession()() as LOADED_STATE)?.data
