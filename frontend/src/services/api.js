import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9002',
  timeout: 15000
});

export function normalizeApiError(err) {
  const status = err?.response?.status ?? 0;
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    'Erro inesperado.';
  return { status, message };
}

// -------------------------
// Docentes (público)
// -------------------------

export async function getDocentes() {
  const { data } = await api.get('/api/docentes');
  return data;
}

export async function getDocenteById(id) {
  const { data } = await api.get(`/api/docentes/${id}`);
  return data;
}
