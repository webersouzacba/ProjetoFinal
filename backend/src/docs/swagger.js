require('dotenv').config();

const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 9002;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PWA Projeto Final API',
    version: '1.0.0',
    description: 'Documentação das APIs do backend (Express + Prisma)'
  },
  servers: [{ url: `http://localhost:${port}`, description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};

module.exports = swaggerJSDoc({
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../modules/**/routes/*.js'),
    path.join(__dirname, '../modules/**/controllers/*.js')
  ]
});
