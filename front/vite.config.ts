import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(( { mode } ) => {
  const env = loadEnv(mode, process.cwd(), '')
  const allowedHost = env.VITE_ALLOWED_HOST?.trim()
  
  return {
    plugins: [vue()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      ...(allowedHost ? { allowedHosts: [allowedHost] } : {}),
    },
  }
})
