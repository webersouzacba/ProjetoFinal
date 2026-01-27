// backend/src/modules/appConfig/controllers/appConfigController.js
const svc = require('../services/appConfigService')

async function getConfig(req, res) {
  return res.json(svc.getConfig())
}

async function toggleAuth(req, res) {
  // Sem segurança (acadêmico): qualquer um pode alternar em runtime.
  return res.json(svc.toggleAuth())
}

module.exports = {
  getConfig,
  toggleAuth
}
