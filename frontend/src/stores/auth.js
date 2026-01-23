import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.token)
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

    // ✅ ADICIONE ISTO
    async logout() {
      // Não há sessão no backend (é JWT). Então basta limpar o client.
      this.clearSession();
    }
  }
});
