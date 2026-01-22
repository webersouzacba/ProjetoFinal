const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 9002;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PWA Projeto Final API',
    version: '1.0.0',
    description: 'Documentação das APIs do backend (Express + Prisma)'
  },
  servers: [
    { url: `http://localhost:${port}`, description: 'Local' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

module.exports = swaggerJSDoc({
  swaggerDefinition,
  // ajuste os caminhos onde estão suas rotas/controllers (JSDoc)
  apis: ['src/modules/**/routes/*.js', 'src/modules/**/controllers/*.js']
});
