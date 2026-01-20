require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');

const { configurePassport } = require('./modules/auth/services/passport');
const { authRoutes } = require('./modules/auth/routes/authRoutes');
const { docenteRoutes } = require('./modules/docentes/routes/docenteRoutes');
const { propostaRoutes } = require('./modules/propostas/routes/propostaRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares base
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Passport (sempre inicializa o middleware)
app.use(passport.initialize());

// Strategy do Google (só configura se tiver credenciais)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  configurePassport();
} else {
  console.warn('OAuth desativado: GOOGLE_CLIENT_ID/SECRET não configurados.');
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));


//Rota de teste temporária
const { prisma } = require('./config/prisma');

app.get('/debug/db', async (req, res, next) => {
  try {
    const docentes = await prisma.docente.count();
    const alunos = await prisma.aluno.count();
    const propostas = await prisma.proposta.count();
    res.json({ docentes, alunos, propostas });
  } catch (e) {
    next(e);
  }
});



// Rotas
app.use('/auth', authRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/propostas', propostaRoutes);

// Erros
app.use(errorHandler);

const port = Number(process.env.PORT || 9002);
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
