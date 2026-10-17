import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Frontend se '/api/...' request backend (Express) tak jati hai -> same-origin cookie, CORS issue nahi
    proxy: { '/api': 'http://localhost:5000' },
  },
})
