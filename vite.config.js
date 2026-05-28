import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env file for the current mode (development / production)
  const env = loadEnv(mode, '.')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        // Dev proxy: forwards /api/* → your backend so CORS is never an issue locally.
        // Uses VITE_API_URL from .env.local (never committed to git).
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          // If your backend URL already contains /api in the path, uncomment this:
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
