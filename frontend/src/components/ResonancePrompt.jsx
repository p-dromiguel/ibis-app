import { useState } from 'react';

const OPTIONS = [
  { status: 'still', label: 'Ainda faz sentido' },
  { status: 'changed', label: 'Mudou' },
  { status: 'gone', label: 'Não mais' },
];

export default function ResonancePrompt({ phrase, onRespond, onDismiss }) {
  const [submitting, setSubmitting] = useState(null);

  async function handleClick(status) {
    if (submitting) return;
    setSubmitting(status);
    try {
      await onRespond(status);
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <section className="resonance-prompt" aria-labelledby="resonance-prompt__title">
      <div className="resonance-prompt__header">
        <h3 id="resonance-prompt__title" className="resonance-prompt__title">
          Ainda ressoa?
        </h3>
        <button
          type="button"
          className="resonance-prompt__dismiss"
          onClick={onDismiss}
          aria-label="Fechar lembrete"
          title="Agora não"
        >
          ✕
        </button>
      </div>

      <blockquote className="resonance-prompt__text">"{phrase.text}"</blockquote>

      {phrase.author && (
        <p className="resonance-prompt__author">— {phrase.author}</p>
      )}

      <div className="resonance-prompt__actions" role="group" aria-label="Sua resposta">
        {OPTIONS.map((opt) => (
          <button
            key={opt.status}
            type="button"
            onClick={() => handleClick(opt.status)}
            disabled={submitting !== null}
            className={`resonance-prompt__btn${
              submitting === opt.status ? ' is-submitting' : ''
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
