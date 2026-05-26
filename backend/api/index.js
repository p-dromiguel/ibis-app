// Handler serverless da Vercel: re-exporta o app Express.
// Todas as rotas chegam aqui via rewrite definido em vercel.json.
module.exports = require('../app');
