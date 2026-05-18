import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPhrase, getPhrases } from '../api/api';
import PhraseForm from '../components/PhraseForm.jsx';
import IbisMark from '../components/IbisMark.jsx';

export default function Share() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [phrases, setPhrases] = useState([]);

  const rawText = (searchParams.get('text') || '').trim();
  const rawUrl = (searchParams.get('url') || '').trim();
  const rawTitle = (searchParams.get('title') || '').trim();

  // Sem nada compartilhado → volta pro feed (evita ficar preso aqui).
  useEffect(() => {
    if (!rawText && !rawUrl && !rawTitle) {
      navigate('/', { replace: true });
    }
  }, [rawText, rawUrl, rawTitle, navigate]);

  // Carrega frases existentes só pra alimentar as "suas tags" do PhraseForm.
  useEffect(() => {
    getPhrases()
      .then((data) => setPhrases(data.phrases || []))
      .catch(() => {});
  }, []);

  // Android Chrome costuma jogar a URL no campo `text` quando você compartilha
  // de páginas web. Detecta isso e separa: texto da frase vs. fonte/link.
  const initialPhrase = useMemo(() => {
    const textIsUrl = /^https?:\/\/\S+$/i.test(rawText);
    const phraseText = textIsUrl ? '' : rawText;
    const sourceParts = [rawTitle, textIsUrl ? rawText : rawUrl].filter(Boolean);
    return {
      text: phraseText,
      author: '',
      source: sourceParts.join(' — '),
      reflection: '',
      tags: [],
    };
  }, [rawText, rawUrl, rawTitle]);

  async function handleSubmit(data) {
    try {
      await createPhrase(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCancel() {
    navigate('/', { replace: true });
  }

  return (
    <div className="feed-container">
      <header className="feed-header">
        <h1 className="logo">
          <IbisMark />
          <span className="logo-word">grifar</span>
        </h1>
      </header>

      <main className="feed-main">
        {error && <div className="error-message">{error}</div>}

        <PhraseForm
          initialPhrase={initialPhrase}
          allPhrases={phrases}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
