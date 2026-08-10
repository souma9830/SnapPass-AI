import React, { useEffect, useState, useRef } from 'react';
import './KeyboardShortcutsModal.css';

const SHORTCUTS_LIST = [
  { key: 'Shift + ?', description: 'Open / Close Keyboard Shortcuts Cheat Sheet' },
  { key: 'Alt + C', description: 'Toggle SnapPass AI Assistant Chatbot' },
  { key: 'Ctrl + S / Cmd + S', description: 'Download Processed Passport Photo' },
  { key: 'Ctrl + P / Cmd + P', description: 'Open Direct Print Preview Dialog' },
  { key: 'Escape', description: 'Close active modal, queue, or overlay' },
  { key: 'Tab / Shift + Tab', description: 'Navigate focusable UI controls' },
];

function KeyboardShortcutsModal({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`keyboard-trigger-floating-btn ${darkMode ? 'trigger-dark' : ''}`}
        title="Keyboard Shortcuts Cheat Sheet (Shift + ?)"
        aria-label="Keyboard Shortcuts Guide"
      >
        ⌨️
      </button>
    );
  }

  return (
    <div className="keyboard-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`keyboard-modal-card ${darkMode ? 'keyboard-modal-dark' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="keyboard-modal-title"
        aria-modal="true"
      >
        <div className="keyboard-modal-header">
          <h3 id="keyboard-modal-title" className="keyboard-modal-title">
            ⌨️ Keyboard Shortcuts Cheat Sheet
          </h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="keyboard-modal-close"
            aria-label="Close shortcuts dialog"
          >
            ✕
          </button>
        </div>

        <div className="keyboard-shortcuts-list">
          {SHORTCUTS_LIST.map((item, idx) => (
            <div key={idx} className="shortcut-row">
              <kbd className="shortcut-kbd">{item.key}</kbd>
              <span className="shortcut-desc">{item.description}</span>
            </div>
          ))}
        </div>

        <div className="keyboard-modal-footer flex justify-between items-center text-xs text-gray-500 mt-4">
          <span>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> or <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift + ?</kbd> to close.</span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
