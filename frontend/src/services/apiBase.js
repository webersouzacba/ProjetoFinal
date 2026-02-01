// Centraliza a construção da URL base do back-end.
// Em Vite, variáveis de ambiente expostas ao client precisam começar com VITE_.

export function apiBaseUrl() {
  // Permite override explícito via VITE_API_BASE_URL (fallback)
  const env = import.meta.env?.VITE_API_BASE_URL
  if (env && env.trim().length) return env.replace(/\/+$/, '')

  const { protocol, hostname } = window.location

  // Regra simples: backend sempre em 5190 no mesmo host
  return `${protocol}//${hostname}:5190`
}