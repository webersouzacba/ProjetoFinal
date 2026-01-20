const express = require('express');
const passport = require('passport');
const { authCallback } = require('../controllers/authController');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', (req, res) =>
    res.status(503).json({ error: 'OAuth não configurado no servidor.' })
  );
  router.get('/google/callback', (req, res) =>
    res.status(503).json({ error: 'OAuth não configurado no servidor.' })
  );
  module.exports = { authRoutes: router };
  return;
}

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failed' }),
  authCallback
);

router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'Falha na autenticação Google.' });
});

module.exports = { authRoutes: router };
