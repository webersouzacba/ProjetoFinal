import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Em Vite, as variáveis do client começam com VITE_.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const target = env.VITE_API_BASE_URL || 'http://localhost:9002';

  return {
    plugins: [vue()],
    server: {
      proxy: {
        // redireciona chamadas do SPA para o backend
        '/api': {
          target,
          changeOrigin: true
        },
        '/auth': {
          target,
          changeOrigin: true
        }
      }
    }
  };
});
