// backend/src/config/runtimeFlags.js
/**
 * Flag de autenticação em runtime (memória).
 * Regra final do projeto:
 * - O sistema sempre inicia com OAuth/JWT ATIVO (authEnabled=true);
 * - Pode ser alternada via endpoint (/api/config/auth/toggle) para fins de
 *   simulação acadêmica (Docente ID=1).
 */

// ✅ Sempre inicia com OAuth ativo
let authEnabledRuntime = true

function getAuthEnabled() {
  return authEnabledRuntime
}

function setAuthEnabled(value) {
  authEnabledRuntime = Boolean(value)
  return authEnabledRuntime
}

function toggleAuthEnabled() {
  authEnabledRuntime = !authEnabledRuntime
  return authEnabledRuntime
}

module.exports = {
  getAuthEnabled,
  setAuthEnabled,
  toggleAuthEnabled
}
