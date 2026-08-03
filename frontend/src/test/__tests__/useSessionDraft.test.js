import { renderHook, act } from '@testing-library/react';
import {
  useSessionDraft,
  loadEditorDraft,
  clearEditorDraft,
} from '../../hooks/useSessionDraft';

describe('useSessionDraft', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('loadEditorDraft returns null when no draft exists', () => {
    expect(loadEditorDraft()).toBeNull();
  });

  test('loadEditorDraft returns null for invalid JSON', () => {
    sessionStorage.setItem('snappass_editor_draft', '{not json');
    expect(loadEditorDraft()).toBeNull();
  });

  test('saveDraft stores draft that loadEditorDraft reads back', () => {
    const { result } = renderHook(() => useSessionDraft());
    act(() => {
      result.current.saveDraft({ filename: 'a.jpg', background: 'white' });
    });
    const draft = loadEditorDraft();
    expect(draft.filename).toBe('a.jpg');
    expect(draft.background).toBe('white');
    expect(draft.updatedAt).toBeDefined();
  });

  test('saveDraft excludes blob localUrl from the persisted draft', () => {
    const { result } = renderHook(() => useSessionDraft());
    act(() => {
      result.current.saveDraft({ filename: 'a.jpg', localUrl: 'blob:abc' });
    });
    const draft = loadEditorDraft();
    expect(draft.localUrl).toBeUndefined();
    expect(draft.filename).toBe('a.jpg');
  });

  test('clearDraft removes the stored draft and updates hook state', () => {
    const { result } = renderHook(() => useSessionDraft());
    act(() => result.current.saveDraft({ filename: 'a.jpg' }));
    expect(loadEditorDraft()).not.toBeNull();

    act(() => result.current.clearDraft());
    expect(loadEditorDraft()).toBeNull();
    expect(result.current.draft).toBeNull();
  });

  test('clearEditorDraft helper removes any stored draft', () => {
    sessionStorage.setItem(
      'snappass_editor_draft',
      JSON.stringify({ filename: 'a.jpg' })
    );
    clearEditorDraft();
    expect(loadEditorDraft()).toBeNull();
  });
});
