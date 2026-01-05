import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const allowedHost = env.VITE_ALLOWED_HOST?.trim();

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@css': path.resolve(__dirname, 'src/assets/css'),
        '@svg': path.resolve(__dirname, 'src/assets/svg'),
        '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@composables': path.resolve(__dirname, 'src/composables'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      ...(allowedHost ? { allowedHosts: [allowedHost] } : {}),
    },
  };
});
