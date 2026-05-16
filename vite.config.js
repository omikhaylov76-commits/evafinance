import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Actions sets VITE_BASE_URL = /repo-name/
  // Locally (file:// or dev server) we keep './' so assets load correctly
  base: process.env.VITE_BASE_URL ?? './',
})
