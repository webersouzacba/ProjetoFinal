// backend/src/index.js
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const passport = require('passport')
const path = require('path')

const { configurePassport } = require('./modules/auth/services/passport')
const { authRoutes } = require('./modules/auth/routes/authRoutes')
const { apiAuthRoutes } = require('./modules/auth/routes/apiAuthRoutes')
const { docenteRoutes } = require('./modules/docentes/routes/docenteRoutes')
const { propostaRoutes } = require('./modules/propostas/routes/propostaRoutes')
const { alunoRoutes } = require('./modules/alunos/routes/alunoRoutes')
const { palavrasChaveRoutes } = require('./modules/palavrasChave/routes/palavrasChaveRoutes')
const { appConfigRoutes } = require('./modules/appConfig/routes/appConfigRoutes')
const { documentosRoutes } = require('./modules/documentos/routes/documentosRoutes')

const { getDocsDir } = require('./modules/documentos/services/documentosService')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

// Middlewares base
if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
} else {
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  )
}

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: false }))
app.use(express.json({ limit: '1mb' }))

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./docs/swagger')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec))

app.use(morgan('dev'))

// Passport (sempre inicializa)
app.use(passport.initialize())

// Strategy do Google (só configura se tiver credenciais)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  configurePassport()
} else {
  console.warn('OAuth desativado: GOOGLE_CLIENT_ID/SECRET não configurados.')
}

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// 📄 Publicação de documentos do projeto (pasta /docs na raiz do repositório)
const docsDir = getDocsDir()
app.use('/docs', express.static(docsDir, { fallthrough: true }))

// Rota de teste temporária
const { prisma } = require('./config/prisma')
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/db', async (req, res, next) => {
    try {
      const docentes = await prisma.docente.count()
      const alunos = await prisma.aluno.count()
      const propostas = await prisma.proposta.count()
      res.json({ docentes, alunos, propostas })
    } catch (e) {
      next(e)
    }
  })
}

// ✅ Config runtime
app.use('/api/config', appConfigRoutes)

// 📄 API pública de listagem de documentos
app.use('/api/documentos', documentosRoutes)

// Rotas existentes
app.use('/auth', authRoutes)
app.use('/api/auth', apiAuthRoutes)
app.use('/api/docentes', docenteRoutes)
app.use('/api/propostas', propostaRoutes)
app.use('/api/alunos', alunoRoutes)
app.use('/api/palavras-chave', palavrasChaveRoutes)

// Erros
app.use(errorHandler)

const port = Number(process.env.PORT || 9002)
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})
