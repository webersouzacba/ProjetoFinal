const jwt = require('jsonwebtoken');

function signToken(docente) {
  const payload = {
    sub: docente.id,
    email: docente.email,
    nome: docente.nome
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
