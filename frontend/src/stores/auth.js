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

/**
 * Store de autenticação.
 * Política final do projeto:
 * - OAuth/JWT é o modo padrão (authEnabled=true).
 * - Quando a autenticação é desativada via UI, o front cria uma sessão simulada
 *   para refletir "Docente ID=1" logado (apenas para avaliação acadêmica).
 */

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.token),
    isDocente: (s) => Boolean(s.token) && s.user?.role === 'DOCENTE',
    isSimulated: (s) => s.token === 'SIM' && s.user?.simulated === true
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

      // Sessão simulada não é JWT
      if (this.token === 'SIM') return { ok: true }

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

      // Sessão simulada não chama /me
      if (this.token === 'SIM') return this.user

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
     * Simulação acadêmica (authEnabled=false)
     * Assume "Docente ID=1" como logado para permitir validação funcional completa.
     */
    async bootstrapSimulatedDocente({ idDocente = 1 } = {}) {
      // Se já existe uma sessão simulada válida, não faz nada.
      if (
        this.token === 'SIM' &&
        this.user?.role === 'DOCENTE' &&
        String(this.user?.id_docente) === String(idDocente)
      ) {
        return this.user
      }

      try {
        const { data } = await api.get(`/api/docentes/${idDocente}`)
        const simUser = {
          ...data,
          role: 'DOCENTE',
          id_docente: data?.id_docente ?? idDocente,
          simulated: true
        }
        this.setSession({ token: 'SIM', user: simUser })
        return simUser
      } catch {
        // fallback (se BD não tiver o docente 1 ainda)
        const simUser = {
          id_docente: idDocente,
          nome: `Docente ${idDocente} (Simulação)`,
          email: 'docente.simulado@local',
          role: 'DOCENTE',
          simulated: true
        }
        this.setSession({ token: 'SIM', user: simUser })
        return simUser
      }
    }
  }
})
