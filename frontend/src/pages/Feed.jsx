import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPhrases,
  createPhrase,
  updatePhrase,
  deletePhrase,
  getResonancePick,
  submitResonance,
  logout,
} from '../api/api';
import PhraseCard from '../components/PhraseCard.jsx';
import PhraseForm from '../components/PhraseForm.jsx';
import IbisMark from '../components/IbisMark.jsx';
import ResonancePrompt from '../components/ResonancePrompt.jsx';
import LogoutModal from '../components/LogoutModal.jsx';

export default function Feed() {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState(null);
  const [error, setError] = useState('');
  const [resonancePick, setResonancePick] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPhrases();
    loadResonancePick();
  }, []);

  async function loadPhrases() {
    try {
      const data = await getPhrases();
      setPhrases(data.phrases);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadResonancePick() {
    try {
      const data = await getResonancePick();
      setResonancePick(data.phrase);
    } catch {
      // silencioso — ressonância é opcional, não trava o feed
    }
  }

  async function handleResonance(status) {
    if (!resonancePick) return;
    try {
      const result = await submitResonance(resonancePick.id, status);
      setPhrases((prev) =>
        prev.map((p) => (p.id === resonancePick.id ? result.phrase : p))
      );
      setResonancePick(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function dismissResonance() {
    setResonancePick(null);
  }

  function openNewForm() {
    setEditingPhrase(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEditForm(phrase) {
    setEditingPhrase(phrase);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditingPhrase(null);
  }

  async function handleSubmitPhrase(data) {
    try {
      if (editingPhrase) {
        const result = await updatePhrase(editingPhrase.id, data);
        setPhrases((prev) =>
          prev.map((p) => (p.id === editingPhrase.id ? result.phrase : p))
        );
      } else {
        const result = await createPhrase(data);
        setPhrases((prev) => [result.phrase, ...prev]);
      }
      closeForm();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePhrase(id);
      setPhrases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function toggleTagFilter(tag) {
    setActiveTag((current) => (current === tag ? null : tag));
  }

  const visiblePhrases = activeTag
    ? phrases.filter((p) => (p.tags || []).includes(activeTag))
    : phrases;

  return (
    <div className="feed-container">
      <header className="feed-header">
        <h1 className="logo">
          <IbisMark />
          <span className="logo-word">íbis</span>
        </h1>
        <button
          type="button"
          onClick={() => setConfirmingLogout(true)}
          className="btn-icon btn-logout"
          aria-label="Sair da conta"
          title="Sair"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {confirmingLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setConfirmingLogout(false)}
        />
      )}

      <main className="feed-main">
        <div className="feed-actions">
          <h2 className="feed-title">Suas frases</h2>
          {!showForm && (
            <button onClick={openNewForm} className="btn-primary">
              + Nova frase
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {resonancePick && !showForm && (
          <ResonancePrompt
            phrase={resonancePick}
            onRespond={handleResonance}
            onDismiss={dismissResonance}
          />
        )}

        {activeTag && (
          <div className="tag-filter" role="status">
            <span className="tag-filter__label">Filtrando por</span>
            <span className="tag-filter__value">#{activeTag}</span>
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="tag-filter__clear"
              aria-label="Limpar filtro"
            >
              ✕ limpar
            </button>
          </div>
        )}

        {showForm && (
          <PhraseForm
            key={editingPhrase?.id || 'new'}
            initialPhrase={editingPhrase}
            allPhrases={phrases}
            onSubmit={handleSubmitPhrase}
            onCancel={closeForm}
          />
        )}

        {loading ? (
          <div className="loading">Carregando suas frases...</div>
        ) : phrases.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">Nenhuma frase ainda.</p>
            <p className="empty-hint">
              Adicione sua primeira frase de um livro, filme ou da rua.
            </p>
          </div>
        ) : visiblePhrases.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">Nenhuma frase com #{activeTag}.</p>
            <p className="empty-hint">
              Tente outra tag ou limpe o filtro acima.
            </p>
          </div>
        ) : (
          <div className="phrases-grid">
            {visiblePhrases.map((phrase) => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                activeTag={activeTag}
                onTagClick={toggleTagFilter}
                onEdit={() => openEditForm(phrase)}
                onDelete={() => handleDelete(phrase.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
