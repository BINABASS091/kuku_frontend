import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env.REACT_ROUTER_FUTURE': {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
})
