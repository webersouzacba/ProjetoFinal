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
     */
    validateLocalToken({ leewaySeconds = 30 } = {}) {
      if (!this.token) return { ok: false, reason: 'missing' }

      const payload = decodeJwtPayload(this.token)
      if (!payload || typeof payload.exp !== 'number') {
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
      if (!this.token) {
        this.user = null
        localStorage.removeItem('user')
        return null
      }

      const v = this.validateLocalToken()
      if (!v.ok) return null

      try {
        const { data } = await api.get('/api/auth/me')
        this.user = data
        localStorage.setItem('user', JSON.stringify(this.user))
        return data
      } catch (err) {
        this.clearSession()
        throw err
      }
    },

    async logout() {
      this.clearSession()
    },

    /**
     * MODO DEV (authEnabled=false)
     * Simula um docente logado (por padrão, id=1) para:
     * - validar controles de autorização no front-end;
     * - exibir estado no cabeçalho.
     */
    async bootstrapDevDocente({ idDocente = 1 } = {}) {
      // Se já existe uma sessão DEV válida, não faz nada.
      if (
        this.token === 'DEV' &&
        this.user?.role === 'DOCENTE' &&
        String(this.user?.id_docente) === String(idDocente)
      ) {
        return this.user
      }

      try {
        const { data } = await api.get(`/api/docentes/${idDocente}`)
        const devUser = {
          ...data,
          role: 'DOCENTE',
          id_docente: data?.id_docente ?? idDocente,
          dev: true
        }
        this.setSession({ token: 'DEV', user: devUser })
        return devUser
      } catch {
        // fallback (se BD não tiver o docente 1 ainda)
        const devUser = {
          id_docente: idDocente,
          nome: `Docente ${idDocente} (DEV)`,
          email: 'dev.docente@local',
          role: 'DOCENTE',
          dev: true
        }
        this.setSession({ token: 'DEV', user: devUser })
        return devUser
      }
    }
  }
})
