const express = require('express');
const passport = require('passport');
const { authCallback } = require('../controllers/authController');

const router = express.Router();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectToLogin = () => {
    const u = new URL(frontend);
    u.pathname = '/login';
    u.searchParams.set('error', 'oauth_unavailable');
    return u.toString();
  };

  router.get('/google', (req, res) => {
    const wantsJson = (req.headers.accept || '').includes('application/json');
    if (wantsJson) {
      return res.status(503).json({ error: 'OAuth não configurado no servidor.' });
    }
    return res.redirect(redirectToLogin());
  });

  router.get('/google/callback', (req, res) => {
    const wantsJson = (req.headers.accept || '').includes('application/json');
    if (wantsJson) {
      return res.status(503).json({ error: 'OAuth não configurado no servidor.' });
    }
    return res.redirect(redirectToLogin());
  });

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

/**
 * ✅ Importante:
 * Usamos custom callback do passport para que, mesmo quando user=false
 * (ex.: docente não cadastrado), possamos cair no authCallback e devolver
 * 403/redirect com mensagem clara.
 */
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) return next(err);

    // passport retorna user=false e info.message='UNAUTHORIZED' quando email não é docente cadastrado
    req.user = user || null;
    req.authInfo = info || null;

    return authCallback(req, res, next);
  })(req, res, next);
});

module.exports = { authRoutes: router };
