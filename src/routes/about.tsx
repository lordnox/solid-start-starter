import { A } from 'solid-start'
import Counter from '~/components/Counter'
import { useQuery } from '~/utils/trpc-client'

export default function About() {
  const [hello] = useQuery('hello', { name: 'Frank ' })

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">{hello()}</h1>
      <Counter />
    </main>
  )
}
