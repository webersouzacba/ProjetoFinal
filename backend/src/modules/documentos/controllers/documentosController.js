const { listDocs } = require('../services/documentosService')

async function list(req, res) {
  const items = listDocs()
  res.json(items)
}

module.exports = {
  list
}
