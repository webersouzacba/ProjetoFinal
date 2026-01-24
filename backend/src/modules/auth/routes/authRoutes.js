const express = require('express');
const passport = require('passport');
const { authCallback } = require('../controllers/authController');

const router = express.Router();


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173'
  const redirectToLogin = () => {
    const u = new URL(frontend)
    u.pathname = '/login'
    u.searchParams.set('error', 'oauth_unavailable')
    return u.toString()
  }

  router.get('/google', (req, res) => {
    const wantsJson = (req.headers.accept || '').includes('application/json')
    if (wantsJson) {
      return res.status(503).json({ error: 'OAuth não configurado no servidor.' })
    }
    return res.redirect(redirectToLogin())
  })

  router.get('/google/callback', (req, res) => {
    const wantsJson = (req.headers.accept || '').includes('application/json')
    if (wantsJson) {
      return res.status(503).json({ error: 'OAuth não configurado no servidor.' })
    }
    return res.redirect(redirectToLogin())
  })
  module.exports = { authRoutes: router };
  return;
}


router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failed' }),
  authCallback
);

router.get('/failed', (req, res) => {
  const wantsJson = (req.headers.accept || '').includes('application/json')
  if (wantsJson) {
    return res.status(403).json({ error: 'Falha na autenticação Google.' });
  }

  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173'
  const redirectUrl = new URL(frontend)
  redirectUrl.pathname = '/login'
  // O passport pode falhar por "UNAUTHORIZED" (docente inexistente) ou outros motivos.
  // Para a UI, tratamos como não-autorizado.
  redirectUrl.searchParams.set('error', 'unauthorized')
  return res.redirect(redirectUrl.toString())
});

module.exports = { authRoutes: router };
