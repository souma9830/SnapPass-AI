import { useState, useCallback } from 'react';

const DRAFT_KEY = 'snappass_editor_draft';

/**
 * Blob URLs are only valid for the current page lifecycle and become dead
 * strings after a reload, so they must never be persisted to sessionStorage.
 */
const toPersistable = ({ localUrl, ...rest }) => rest;

export const loadEditorDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load editor draft:', error);
    return null;
  }
};

export const clearEditorDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear editor draft:', error);
  }
};

export function useSessionDraft() {
  const [draft, setDraft] = useState(loadEditorDraft);

  const saveDraft = useCallback((data) => {
    const next = { ...toPersistable(data), updatedAt: Date.now() };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Failed to save editor draft:', error);
    }
    setDraft(next);
  }, []);

  const clearDraft = useCallback(() => {
    clearEditorDraft();
    setDraft(null);
  }, []);

  return { draft, saveDraft, clearDraft };
}

export default useSessionDraft;
