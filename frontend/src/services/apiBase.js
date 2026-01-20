// Centraliza a construção da URL base do back-end.
// Em Vite, variáveis de ambiente expostas ao client precisam começar com VITE_.

export function apiBaseUrl() {
  // Ex.: http://localhost:9002
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:9002';
}
