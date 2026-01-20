import axios from 'axios';
import { apiBaseUrl } from './apiBase';

// Axios instance
export const api = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 15000
});

// Interceptor simples para Authorization (quando houver token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
