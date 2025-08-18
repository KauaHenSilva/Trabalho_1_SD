import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: isDev
      ? {
          host: true, // listen on 0.0.0.0 in Docker
          port: 5173,
          strictPort: true,
          watch: {
            usePolling: true, // ensure file changes are detected on Windows + Docker
          },
          hmr: {
            host: 'localhost',
            port: 5173,
          },
        }
      : undefined,
  }
})
