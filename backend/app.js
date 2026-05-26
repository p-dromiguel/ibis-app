const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const phrasesRoutes = require('./routes/phrases');

const app = express();

// Em produção, FRONTEND_URL restringe quem pode chamar a API.
// Em dev (sem a env), libera localhost:5173 (Vite padrão).
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API do ibis rodando 🚀' });
});

app.use('/auth', authRoutes);
app.use('/phrases', phrasesRoutes);

module.exports = app;
