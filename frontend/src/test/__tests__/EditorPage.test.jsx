import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../../context/LanguageContext';

const router = vi.hoisted(() => ({
  useLocation: vi.fn(() => ({ state: { localUrl: 'data:image/png;base64,AAAA' } })),
  useNavigate: vi.fn(),
}));

const imageProcessor = vi.hoisted(() => ({
  useImageProcessor: vi.fn(),
}));

const DummyComponent = vi.hoisted(() => (props) => props.children || null);

vi.mock('react-router-dom', () => ({
  useLocation: router.useLocation,
  useNavigate: router.useNavigate,
}));

vi.mock('../../hooks/useImageProcessor', () => ({
  default: imageProcessor.useImageProcessor,
}));

vi.mock('../../services/api', () => ({
  default: {
    defaults: { baseURL: '' },
    post: vi.fn().mockResolvedValue({ data: { success: false } }),
  },
}));

vi.mock('../../utils/sessionManager', () => ({
  saveSession: vi.fn(),
  getSession: vi.fn().mockReturnValue(null),
}));

vi.mock('../../services/photoService', () => ({
  uploadPhoto: vi.fn().mockResolvedValue({ filename: 'test.jpg' }),
}));

vi.mock('../../utils/imageEnhancer', () => ({
  autoEnhanceImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,BBBB'),
}));

vi.mock('../../services/indexedDb', () => ({
  cachePhotoOffline: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../components/SizeSelector', () => ({ default: DummyComponent }));
vi.mock('../../components/BackgroundSelector', () => ({ default: DummyComponent }));
vi.mock('../../components/AttireSelector', () => ({ default: DummyComponent }));
vi.mock('../../components/CompliancePanel', () => ({ default: DummyComponent }));
vi.mock('../../components/ImageAdjustments', () => ({ ImageAdjustments: DummyComponent }));
vi.mock('../../components/AttireManualAdjuster', () => ({ AttireManualAdjuster: DummyComponent }));
vi.mock('../../pages/EditorPageDiagnostics', () => ({ default: DummyComponent }));

import EditorPage from '../../pages/EditorPage';

const renderEditorPage = () => {
  return render(
    <LanguageProvider>
      <EditorPage darkMode={false} />
    </LanguageProvider>
  );
};

beforeEach(() => {
  sessionStorage.clear();
  imageProcessor.useImageProcessor.mockReturnValue({
    processImage: vi.fn(),
    processedUrl: null,
    isProcessing: false,
    error: null,
    reset: vi.fn(),
  });
  router.useLocation.mockReturnValue({ state: { localUrl: 'data:image/png;base64,AAAA' } });
});

describe('EditorPage session draft resume', () => {
  test('does not show the resume banner for a fresh upload', () => {
    renderEditorPage();
    expect(screen.queryByText(/Resume your previous edit/i)).not.toBeInTheDocument();
  });

  test('shows the resume banner when a saved draft exists', async () => {
    sessionStorage.setItem(
      'snappass_editor_draft',
      JSON.stringify({ filename: 'a.jpg', background: 'white' })
    );
    router.useLocation.mockReturnValue({ state: {} });

    renderEditorPage();

    expect(
      await screen.findByText(/We saved your editing progress/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Resume' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Start Fresh' })
    ).toBeInTheDocument();
  });

  test('Resume restores the draft and hides the banner', async () => {
    sessionStorage.setItem(
      'snappass_editor_draft',
      JSON.stringify({
        filename: 'resume.jpg',
        background: 'blue',
        sizePreset: '2x2in',
        attire: 'none',
        processedBase64: 'data:image/png;base64,CCCC',
      })
    );
    router.useLocation.mockReturnValue({ state: {} });

    renderEditorPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Resume' }));

    await waitFor(() => {
      expect(
        screen.queryByText(/Resume your previous edit/i)
      ).not.toBeInTheDocument();
    });

    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,CCCC');
  });

  test('Start Fresh clears the saved draft', async () => {
    sessionStorage.setItem(
      'snappass_editor_draft',
      JSON.stringify({ filename: 'a.jpg', background: 'white' })
    );
    router.useLocation.mockReturnValue({ state: {} });

    renderEditorPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Start Fresh' }));

    await waitFor(() => {
      expect(sessionStorage.getItem('snappass_editor_draft')).toBeNull();
    });
    expect(
      screen.queryByText(/Resume your previous edit/i)
    ).not.toBeInTheDocument();
  });
});
