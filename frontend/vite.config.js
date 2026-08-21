import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards /api/* to the Spring Boot backend during `npm run dev`,
    // so the frontend can call relative paths like fetch('/api/services')
    // without hardcoding http://localhost:8080 or hitting CORS issues.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
