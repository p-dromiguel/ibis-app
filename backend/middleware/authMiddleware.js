const jwt = require('jsonwebtoken');

// Middleware: função que roda ANTES da rota principal.
// Ela intercepta o request, verifica se o token JWT é válido,
// e só deixa passar se for. Caso contrário, retorna 401.
function authMiddleware(req, res, next) {
  // O token vem no header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Separa "Bearer" do token em si
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  // Verifica se o token é válido usando a mesma chave secreta que usamos pra gerar
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Se o token é válido, coloca o user_id dentro do request
    // para que as rotas seguintes possam usar
    req.userId = decoded.id;
    return next();
  });
}

module.exports = authMiddleware;
