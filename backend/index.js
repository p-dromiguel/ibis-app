// Entrypoint só de dev local: sobe o Express na porta 3001.
// Em produção (Vercel), o handler vive em api/index.js e não passa por aqui.
const app = require('./app');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
