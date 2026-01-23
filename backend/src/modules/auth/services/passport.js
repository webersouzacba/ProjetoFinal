const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('../../../config/prisma');

function configurePassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    throw new Error('OAuth: GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL não configurados');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleSub = profile.id;
          const email = profile.emails?.[0]?.value || null;
          const nome = profile.displayName || 'Docente';

          if (!email) {
            return done(null, false, { message: 'Conta Google sem e-mail disponível.' });
          }

          const docenteExistente = await prisma.docente.findUnique({
            where: { email }
          });

          if (!docenteExistente) {
            // Política do projeto: somente docentes previamente registados podem autenticar
            return done(null, false, { message: 'Acesso negado: docente não registado.' });
          }

          const docente = await prisma.docente.update({
            where: { email },
            data: { nome, googleSub }
          });

          return done(null, docente);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  return passport;
}

module.exports = { configurePassport };
