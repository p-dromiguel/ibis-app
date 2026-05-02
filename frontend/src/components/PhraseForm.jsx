import { useMemo, useState } from 'react';
import { PRESET_TAGS, normalizeTag } from '../constants/tags.js';

export default function PhraseForm({ onSubmit, onCancel, initialPhrase, allPhrases = [] }) {
  const isEditing = !!initialPhrase;
  const [text, setText] = useState(initialPhrase?.text || '');
  const [author, setAuthor] = useState(initialPhrase?.author || '');
  const [source, setSource] = useState(initialPhrase?.source || '');
  const [reflection, setReflection] = useState(initialPhrase?.reflection || '');
  const [selectedTags, setSelectedTags] = useState(
    () => (initialPhrase?.tags || []).map(normalizeTag)
  );
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);

  const userTags = useMemo(() => {
    const set = new Set();
    for (const p of allPhrases) {
      if (initialPhrase && p.id === initialPhrase.id) continue;
      for (const t of p.tags || []) {
        const norm = normalizeTag(t);
        if (norm && !PRESET_TAGS.includes(norm)) set.add(norm);
      }
    }
    return Array.from(set).sort();
  }, [allPhrases, initialPhrase]);

  function toggleTag(tag) {
    const norm = normalizeTag(tag);
    if (!norm) return;
    setSelectedTags((prev) =>
      prev.includes(norm) ? prev.filter((t) => t !== norm) : [...prev, norm]
    );
  }

  function handleCustomKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const norm = normalizeTag(customInput);
      if (norm && !selectedTags.includes(norm)) {
        setSelectedTags((prev) => [...prev, norm]);
      }
      setCustomInput('');
    } else if (e.key === 'Backspace' && customInput === '' && selectedTags.length > 0) {
      setSelectedTags((prev) => prev.slice(0, -1));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const pending = normalizeTag(customInput);
    const finalTags = pending && !selectedTags.includes(pending)
      ? [...selectedTags, pending]
      : selectedTags;

    try {
      await onSubmit({
        text,
        author: author || null,
        source: source || null,
        reflection: reflection || null,
        tags: finalTags,
      });
    } finally {
      setLoading(false);
    }
  }

  const customSelected = selectedTags.filter(
    (t) => !PRESET_TAGS.includes(t) && !userTags.includes(t)
  );

  return (
    <form onSubmit={handleSubmit} className="phrase-form">
      <div className="phrase-form__header">
        {isEditing ? 'Editar frase' : 'Nova frase'}
      </div>

      <div className="input-group">
        <label htmlFor="phrase-text">Frase *</label>
        <textarea
          id="phrase-text"
          placeholder="A frase que te marcou..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="input-group">
          <label htmlFor="phrase-author">Autor</label>
          <input
            id="phrase-author"
            type="text"
            placeholder="Quem disse?"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="phrase-source">Fonte</label>
          <input
            id="phrase-source"
            type="text"
            placeholder="Livro, filme, rua..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="phrase-reflection">Reflexão</label>
        <textarea
          id="phrase-reflection"
          placeholder="Por que essa frase te marcou? Onde você estava? O que sentiu?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
        />
      </div>

      <div className="input-group tag-picker">
        <label>Tags</label>

        <div className="tag-picker__group" role="group" aria-label="Tags sugeridas">
          {PRESET_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`tag-chip${active ? ' is-active' : ''}`}
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {userTags.length > 0 && (
          <div className="tag-picker__group tag-picker__group--user" role="group" aria-label="Suas tags">
            <span className="tag-picker__sublabel">Suas tags</span>
            {userTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`tag-chip tag-chip--user${active ? ' is-active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {customSelected.length > 0 && (
          <div className="tag-picker__group tag-picker__group--custom" role="group" aria-label="Tags criadas agora">
            {customSelected.map((tag) => (
              <button
                key={tag}
                type="button"
                className="tag-chip tag-chip--custom is-active"
                onClick={() => toggleTag(tag)}
                aria-pressed="true"
                title="Clique pra remover"
              >
                {tag} <span className="tag-chip__remove" aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}

        <input
          id="phrase-tags"
          type="text"
          className="tag-picker__input"
          placeholder="criar tag nova (Enter pra adicionar)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleCustomKeyDown}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? 'Salvando...'
            : isEditing
            ? 'Salvar alterações'
            : 'Adicionar frase'}
        </button>
      </div>
    </form>
  );
}
