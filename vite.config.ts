import solid from 'solid-start/vite'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'

export default defineConfig(() => {
  dotenv.config()
  return {
    plugins: [solid({ ssr: false })],
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
    },
  }
})
