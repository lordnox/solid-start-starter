// import solid from 'solid-start/vite'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(() => {
  dotenv.config()
  return {
    plugins: [solidPlugin()],
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
    },
  }
})
