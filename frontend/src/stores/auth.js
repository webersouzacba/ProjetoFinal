import { defineStore } from 'pinia'
import { api } from '../services/apiClient'

function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.')
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)

    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.token),
    isDocente: (s) => Boolean(s.token) && s.user?.role === 'DOCENTE'
  },

  actions: {
    setSession({ token, user }) {
      this.token = token || ''
      this.user = user || null
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    setToken(token) {
      this.token = token || ''
      localStorage.setItem('token', this.token)
    },

    clearSession() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    /**
     * Validação local do token (exp) para evitar UI incoerente.
     * Retorna:
     *  - { ok: true } se token está presente e não expirou
     *  - { ok: false, reason: 'missing' | 'expired' | 'invalid' } caso contrário
     */
    validateLocalToken({ leewaySeconds = 30 } = {}) {
      if (!this.token) return { ok: false, reason: 'missing' }

      const payload = decodeJwtPayload(this.token)
      if (!payload || typeof payload.exp !== 'number') {
        // Token não é JWT ou payload inválido
        this.clearSession()
        return { ok: false, reason: 'invalid' }
      }

      const now = Math.floor(Date.now() / 1000)
      if (payload.exp <= now + leewaySeconds) {
        this.clearSession()
        return { ok: false, reason: 'expired' }
      }

      return { ok: true }
    },

    async fetchMe() {
      // Se não há token, não há o que buscar
      if (!this.token) {
        this.user = null
        localStorage.removeItem('user')
        return null
      }

      // Antes de chamar API, valida exp localmente
      const v = this.validateLocalToken()
      if (!v.ok) return null

      try {
        const { data } = await api.get('/api/auth/me')
        this.user = data
        localStorage.setItem('user', JSON.stringify(this.user))
        return data
      } catch (err) {
        // 401/403 -> limpa sessão (coerência UI)
        this.clearSession()
        throw err
      }
    },

    async logout() {
      // JWT: não há sessão no backend. Basta limpar no client.
      this.clearSession()
    }
  }
})
