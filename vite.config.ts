import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_ROUTER_FUTURE': {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
})
