// frontend/src/stores/config.js
import { defineStore } from 'pinia'
import { api } from '../services/apiClient'

export const useConfigStore = defineStore('config', {
  state: () => ({
    authEnabled: null, // null = ainda não carregou
    loading: false,
    error: null
  }),

  getters: {
    isReady: (s) => s.authEnabled !== null,
    isAuthEnabled: (s) => Boolean(s.authEnabled) === true
  },

  actions: {
    async fetchConfig() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/api/config')
        this.authEnabled = Boolean(data?.authEnabled)
        return this.authEnabled
      } catch (e) {
        this.error = e
        // fallback seguro: assume auth ligado se falhar
        this.authEnabled = true
        return this.authEnabled
      } finally {
        this.loading = false
      }
    },

    async toggleAuthMode() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/api/config/auth/toggle')
        this.authEnabled = Boolean(data?.authEnabled)
        return this.authEnabled
      } catch (e) {
        this.error = e
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
