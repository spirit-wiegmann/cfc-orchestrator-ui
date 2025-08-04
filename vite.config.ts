import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: process.env.NODE_ENV === 'production' 
    ? '/cfc-orchestrator-ui/' 
    : '/',
  define: {
    'process.env.VITE_GITHUB_CLIENT_ID': JSON.stringify(process.env.VITE_GITHUB_CLIENT_ID),
    'process.env.VITE_REDIRECT_URI': JSON.stringify(process.env.VITE_REDIRECT_URI),
    'process.env.VITE_ORCHESTRATOR_REPO': JSON.stringify(process.env.VITE_ORCHESTRATOR_REPO),
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
})
