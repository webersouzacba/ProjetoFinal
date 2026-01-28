// backend/src/modules/appConfig/services/appConfigService.js
const { getAuthEnabled, toggleAuthEnabled, setAuthEnabled } = require('../../../config/runtimeFlags')

/**
 * Configuração exposta ao front-end.
 * Política final do projeto:
 * - Sempre inicia com authEnabled=true (OAuth/JWT ativo);
 * - O professor avaliador pode alternar via UI para simulação acadêmica (authEnabled=false).
 */

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
