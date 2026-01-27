// backend/src/config/runtimeFlags.js
/**
 * Feature flags em runtime (memória).
 * - Inicializa a partir de process.env.AUTH_ENABLED
 * - Pode ser alternada via endpoint (/api/config/auth/toggle)
 */

let authEnabledRuntime = (() => {
  const v = String(process.env.AUTH_ENABLED ?? 'true').toLowerCase()
  return !(v === 'false' || v === '0' || v === 'no')
})()

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
