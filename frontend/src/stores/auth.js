import { defineStore } from 'pinia';
import { api } from '../services/apiClient'

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
      this.token = token || '';
      this.user = user || null;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    setToken(token) {
      this.token = token || '';
      localStorage.setItem('token', this.token);
    },

    clearSession() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    async fetchMe() {
      // Se não há token, não há o que buscar
      if (!this.token) {
        this.user = null
        localStorage.removeItem('user')
        return null
      }

      try {
        const { data } = await api.get('/api/auth/me')
        this.user = data
        localStorage.setItem('user', JSON.stringify(this.user))
        return data
      } catch (err) {
        // Token inválido/expirado ou sem permissão -> limpa sessão
        this.clearSession()
        throw err
      }
    },

    // ✅ ADICIONE ISTO
    async logout() {
      // Não há sessão no backend (é JWT). Então basta limpar o client.
      this.clearSession();
    }
  }
});
