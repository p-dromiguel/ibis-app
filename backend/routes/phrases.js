const express = require('express');
const prisma = require('../db/connection');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const phraseSelect = {
  id: true,
  text: true,
  author: true,
  source: true,
  reflection: true,
  tags: true,
  resonanceStatus: true,
  lastResonanceAt: true,
  createdAt: true,
};

const RESONANCE_STATUSES = ['still', 'changed', 'gone'];
const RESONANCE_MIN_AGE_DAYS = 3;

// GET /phrases/resonance — sorteia uma frase pra pergunta "Ainda ressoa?"
// Prioriza frases nunca respondidas; fallback pras respondidas há mais tempo.
// Retorna { phrase: null } se não houver candidata.
router.get('/resonance', async (req, res) => {
  try {
    const minAge = new Date(Date.now() - RESONANCE_MIN_AGE_DAYS * 24 * 60 * 60 * 1000);

    const candidates = await prisma.phrase.findMany({
      where: {
        userId: req.userId,
        createdAt: { lte: minAge },
      },
      select: phraseSelect,
    });

    if (candidates.length === 0) {
      return res.json({ phrase: null });
    }

    const unanswered = candidates.filter((p) => p.lastResonanceAt === null);
    const pool = unanswered.length > 0
      ? unanswered
      : [...candidates].sort((a, b) => a.lastResonanceAt - b.lastResonanceAt).slice(0, Math.max(3, Math.ceil(candidates.length / 3)));

    const pick = pool[Math.floor(Math.random() * pool.length)];
    return res.json({ phrase: pick });
  } catch (err) {
    console.error('Erro ao sortear frase pra ressonância:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /phrases/:id/resonance — registra a resposta do usuário
router.post('/:id/resonance', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!RESONANCE_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const updated = await prisma.phrase.updateMany({
      where: { id, userId: req.userId },
      data: {
        resonanceStatus: status,
        lastResonanceAt: new Date(),
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Frase não encontrada' });
    }

    const phrase = await prisma.phrase.findUnique({
      where: { id },
      select: phraseSelect,
    });

    return res.json({ message: 'Resposta registrada', phrase });
  } catch (err) {
    console.error('Erro ao registrar ressonância:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /phrases — lista frases do usuário logado
router.get('/', async (req, res) => {
  try {
    const phrases = await prisma.phrase.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      select: phraseSelect,
    });

    return res.json({ phrases });
  } catch (err) {
    console.error('Erro ao listar frases:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /phrases — cria uma nova frase pro usuário logado
router.post('/', async (req, res) => {
  try {
    const { text, author, source, reflection, tags } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'O texto da frase é obrigatório' });
    }

    const phrase = await prisma.phrase.create({
      data: {
        userId: req.userId,
        text: text.trim(),
        author: author || null,
        source: source || null,
        reflection: reflection || null,
        tags: tags || [],
      },
      select: phraseSelect,
    });

    return res.status(201).json({
      message: 'Frase criada com sucesso',
      phrase,
    });
  } catch (err) {
    console.error('Erro ao criar frase:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /phrases/:id — atualiza uma frase (só se pertencer ao usuário logado)
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { text, author, source, reflection, tags } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'O texto da frase é obrigatório' });
    }

    // updateMany filtra por id E userId — garante que um usuário não edita frase de outro
    const updated = await prisma.phrase.updateMany({
      where: { id, userId: req.userId },
      data: {
        text: text.trim(),
        author: author || null,
        source: source || null,
        reflection: reflection || null,
        tags: tags || [],
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Frase não encontrada' });
    }

    const phrase = await prisma.phrase.findUnique({
      where: { id },
      select: phraseSelect,
    });

    return res.json({
      message: 'Frase atualizada com sucesso',
      phrase,
    });
  } catch (err) {
    console.error('Erro ao atualizar frase:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /phrases/:id — deleta uma frase (só se pertencer ao usuário logado)
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deleted = await prisma.phrase.deleteMany({
      where: { id, userId: req.userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Frase não encontrada' });
    }

    return res.json({ message: 'Frase deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar frase:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
