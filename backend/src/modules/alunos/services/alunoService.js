const repo = require('../repositories/alunoRepository');

async function list() {
  return repo.list();
}

async function get(id) {
  return repo.getById(id);
}

module.exports = { list, get };
