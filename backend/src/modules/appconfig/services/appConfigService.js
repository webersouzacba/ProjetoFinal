// backend/src/modules/appConfig/services/appConfigService.js
const { getAuthEnabled, toggleAuthEnabled, setAuthEnabled } = require('../../../config/runtimeFlags')

function getConfig() {
  return {
    authEnabled: getAuthEnabled()
  }
}

function toggleAuth() {
  return {
    authEnabled: toggleAuthEnabled()
  }
}

/**
 * Se quiser suportar PUT com boolean explícito no futuro.
 */
function setAuth(value) {
  return {
    authEnabled: setAuthEnabled(value)
  }
}

module.exports = {
  getConfig,
  toggleAuth,
  setAuth
}
