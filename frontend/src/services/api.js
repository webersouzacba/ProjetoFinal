import axios from 'axios';
import { api as authApi } from './apiClient';

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

// -------------------------
// Docentes (autenticado)
// -------------------------

export async function createDocente(payload) {
  const { data } = await authApi.post('/api/docentes', payload);
  return data;
}

export async function updateDocente(id, payload) {
  const { data } = await authApi.put(`/api/docentes/${id}`, payload);
  return data;
}

export async function deleteDocente(id) {
  await authApi.delete(`/api/docentes/${id}`);
}

// -------------------------
// Alunos (autenticado)
// -------------------------

export async function getAlunos() {
  const { data } = await authApi.get('/api/alunos');
  return data;
}

export async function getAlunoById(id) {
  const { data } = await authApi.get(`/api/alunos/${id}`);
  return data;
}

export async function createAluno(payload) {
  const { data } = await authApi.post('/api/alunos', payload);
  return data;
}

export async function updateAluno(id, payload) {
  const { data } = await authApi.put(`/api/alunos/${id}`, payload);
  return data;
}

export async function deleteAluno(id) {
  await authApi.delete(`/api/alunos/${id}`);
}
