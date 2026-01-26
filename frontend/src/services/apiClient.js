import axios from 'axios'
import { apiBaseUrl } from './apiBase'

// Axios instance
export const api = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 15000
})

// Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se backend retornar 401, derruba sessão local e força voltar ao login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Evita loop infinito se já estiver no login/callback
      const path = window.location.pathname || ''
      const isLogin = path.includes('/login')
      const isCallback = path.includes('/auth/callback')

      if (!isLogin && !isCallback) {
        const redirect = encodeURIComponent(path + (window.location.search || ''))
        window.location.href = `/login?reason=session_expired&redirect=${redirect}`
      }
    }

    return Promise.reject(error)
  }
)

export default api
