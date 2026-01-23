const express = require('express');
const passport = require('passport');
const { authCallback } = require('../controllers/authController');

const router = express.Router();


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
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failed?reason=forbidden' }),
  authCallback
);

router.get('/failed', (req, res) => {
  const reason = String(req.query.reason || '');
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Se o cliente espera JSON, responder com status adequado.
  const wantsJson = (req.headers.accept || '').includes('application/json');
  if (wantsJson) {
    const status = reason === 'forbidden' ? 403 : 401;
    return res.status(status).json({ error: reason === 'forbidden' ? 'Docente não autorizado.' : 'Falha na autenticação Google.' });
  }

  // Redireciona para o front com um erro amigável
  const redirectUrl = new URL(frontend);
  redirectUrl.pathname = '/login';
  redirectUrl.searchParams.set('error', reason === 'forbidden' ? 'unauthorized' : 'auth_failed');
  return res.redirect(redirectUrl.toString());
});


module.exports = { authRoutes: router };
