import { useState } from 'react';

export default function PhraseCard({ phrase, onDelete, onEdit, onTagClick, activeTag }) {
  const [confirming, setConfirming] = useState(false);

  const date = new Date(phrase.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className={`phrase-card ${confirming ? 'is-confirming' : ''}`}>
      <blockquote className="phrase-text">"{phrase.text}"</blockquote>

      {phrase.author && (
        <p className="phrase-author">— {phrase.author}</p>
      )}

      <div className="phrase-meta">
        {phrase.source && (
          <span className="phrase-source">{phrase.source}</span>
        )}
        <span className="phrase-date">{date}</span>
      </div>

      {phrase.tags && phrase.tags.length > 0 && (
        <div className="phrase-tags">
          {phrase.tags.map((tag, i) =>
            onTagClick ? (
              <button
                key={i}
                type="button"
                className={`tag tag--clickable${tag === activeTag ? ' is-active' : ''}`}
                onClick={() => onTagClick(tag)}
                aria-pressed={tag === activeTag}
                title={tag === activeTag ? 'Limpar filtro' : `Filtrar por #${tag}`}
              >
                #{tag}
              </button>
            ) : (
              <span key={i} className="tag">#{tag}</span>
            )
          )}
        </div>
      )}

      {phrase.reflection && (
        <div className="phrase-reflection">
          <span className="phrase-reflection__label">Reflexão</span>
          <p className="phrase-reflection__text">{phrase.reflection}</p>
        </div>
      )}

      {confirming ? (
        <div className="phrase-confirm" role="group" aria-label="Confirmar exclusão">
          <span className="phrase-confirm__label">Deletar?</span>
          <button
            type="button"
            onClick={onDelete}
            className="phrase-confirm__yes"
            autoFocus
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="phrase-confirm__no"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="phrase-card__actions">
          <button
            type="button"
            onClick={onEdit}
            className="btn-icon"
            aria-label="Editar frase"
            title="Editar frase"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="btn-icon btn-icon--danger"
            aria-label="Deletar frase"
            title="Deletar frase"
          >
            ✕
          </button>
        </div>
      )}
    </article>
  );
}
