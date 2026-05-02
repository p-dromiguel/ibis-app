const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const phrasesRoutes = require('./routes/phrases');

const app = express();
const PORT = process.env.PORT || 3001;

// Em produção, FRONTEND_URL restringe quem pode chamar a API.
// Em dev (sem a env), libera localhost:5173 (Vite padrão).
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Rota de teste — serve pra verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.json({ message: 'API do App de Frases está rodando! 🚀' });
});

// Rotas da aplicação
app.use('/auth', authRoutes);
app.use('/phrases', phrasesRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
