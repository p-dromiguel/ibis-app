import { useEffect, useRef } from 'react';

export default function LogoutModal({ onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal__title"
    >
      <div className="modal">
        <h2 id="logout-modal__title" className="modal__title">
          Sair da sua conta?
        </h2>
        <p className="modal__text">
          Você vai precisar entrar de novo pra acessar suas frases.
        </p>
        <div className="modal__actions">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-primary"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
