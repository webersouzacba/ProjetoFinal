import { defineStore } from 'pinia';
import { api } from '../services/apiClient';

function toParams(filtros) {
  const params = {};
  if (filtros?.status) params.status = filtros.status;
  if (filtros?.orientador_id) params.orientador_id = filtros.orientador_id;
  return params;
}

export const usePropostasStore = defineStore('propostas', {
  state: () => ({
    items: [],
    current: null,
    loading: false,
    error: null,
    filtros: {
      status: '',
      orientador_id: ''
    }
  }),

  getters: {
    isAuthenticated: () => Boolean(localStorage.getItem('token'))
  },

  actions: {
    async fetchPublic() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/api/propostas', { params: toParams(this.filtros) });
        this.items = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = e?.response?.data?.error || e.message || 'Erro ao carregar propostas.';
      } finally {
        this.loading = false;
      }
    },

  async fetchPublicDetail(id) {
    this.loading = true;
    this.error = null;
    try {
      const { data } = await api.get(`/api/propostas/${id}`);
      this.current = data; // ✅ consistente
      return data;
    } catch (e) {
      this.error = e?.response?.data?.error || e.message || 'Erro ao carregar proposta';
      this.current = null;
      return null;
    } finally {
      this.loading = false;
    }
  },

    async fetchMine() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/api/propostas/mine');
        this.items = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = e?.response?.data?.error || e.message || 'Erro ao carregar minhas propostas.';
      } finally {
        this.loading = false;
      }
    },

    async createMine(payload) {
      const { data } = await api.post('/api/propostas/mine', payload);
      return data;
    },

    async updateMine(id, payload) {
      const { data } = await api.put(`/api/propostas/mine/${id}`, payload);
      return data;
    },

    async deleteMine(id) {
      await api.delete(`/api/propostas/mine/${id}`);
    }
  }
});
