import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(( { mode } ) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: [env.VITE_ALLOWED_HOST],
    },
  }
})
