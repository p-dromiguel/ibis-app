# íbis

> *"Os limites da minha linguagem são os limites do meu mundo."*  
> — Ludwig Wittgenstein

Algumas frases param a gente no meio de um livro, um filme, uma conversa.

E acabam no bloco de notas — entre uma lista de compras e um link qualquer. Sem contexto, sem o que você estava sentindo. Depois de um tempo, nem lembra por que anotou.

O íbis é um lugar pra guardar frases com cuidado — com reflexão, com contexto, com a pergunta que volta de tempos em tempos: essa frase ainda faz sentido pra você?

O nome vem de Thoth, o deus egípcio da escrita, cuja representação terrena era o íbis.

---

Algumas frases você lê. Outras te leem.

---

## O que dá pra fazer

- Salvar frases com autor, fonte e uma reflexão pessoal
- Organizar por tags (amor, tempo, memória, identidade...)
- Receber revisitas aleatórias: *"Ainda ressoa? Mudou? Não mais?"*
- Criar uma coleção que evolui com você

## Stack

**Front-end**
- React 19
- React Router DOM

**Back-end**
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT + bcrypt
- CORS + dotenv

## Rodando localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando localmente

### Back-end

```bash
cd backend
npm install
cp .env.example .env
# preencha as variáveis no .env
npx prisma migrate dev
npm run dev
```

### Front-end

```bash
cd frontend
npm install
cp .env.example .env
# preencha a URL do backend no .env
npm run dev
```

## Deploy

- Front-end: [Vercel](https://ibis-frases.vercel.app)
- Back-end: Render

---

Feito por [Pedro Miguel](https://github.com/p-dromiguel)
