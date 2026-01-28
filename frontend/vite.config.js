import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Em Vite, as variáveis do client começam com VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const target = (env.VITE_API_BASE_URL || 'http://localhost:9002').replace(/\/+$/, '')

  return {
    // DEV: roda em / (localhost:5173)
    // PROD: build para ser servido em /projetofinal/
    base: mode === 'production' ? '/projetofinal/' : '/',

    plugins: [vue()],

    // Apenas para DEV (Vite dev server)
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
