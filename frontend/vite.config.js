import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Em Vite, as variáveis do client começam com VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const target = (env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://localhost:5190').replace(/\/+$/, '')

  return {
    // DEV: roda em / (localhost:9102)
    // PROD: build para ser servido em /projetofinal/
    base: mode === 'production' ? '/projetofinal/' : '/',

    plugins: [vue()],

    // Apenas para DEV (Vite dev server)
    server: {
      port: 9102,
      strictPort: true,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false
        },

        /**
         * ✅ IMPORTANTE:
         * NÃO podemos proxyar '/auth' inteiro, porque isso captura também
         * o route do frontend '/auth/callback' (Vue Router).
         *
         * Então, proxyamos APENAS as rotas do backend que iniciam o OAuth.
         */
        '^/auth/google$': {
          target,
          changeOrigin: true,
          secure: false
        },
        '^/auth/google/callback$': {
          target,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
