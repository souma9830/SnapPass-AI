import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
  imageProcessor.useImageProcessor.mockReturnValue({
    processImage: vi.fn(),
    processedUrl: null,
    isProcessing: false,
    error: null,
    reset: vi.fn(),
  });
});

describe('EditorPage grid overlay', () => {
  test('renders toggle buttons for grid and eyeline', () => {
    renderEditorPage();
    expect(screen.getByRole('button', { name: 'Show Grid Lines' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Eyeline Guide' })).toBeInTheDocument();
  });

  test('grid overlay is hidden by default', () => {
    const { container } = renderEditorPage();
    expect(container.querySelector('.editor-page__grid-overlay')).not.toBeInTheDocument();
  });

  test('toggling grid on shows the rule-of-thirds overlay', () => {
    const { container } = renderEditorPage();
    fireEvent.click(screen.getByRole('button', { name: 'Show Grid Lines' }));
    const overlay = container.querySelector('.editor-page__grid-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  test('eyeline toggle is disabled until grid is enabled', () => {
    renderEditorPage();
    const eyelineBtn = screen.getByRole('button', { name: 'Show Eyeline Guide' });
    expect(eyelineBtn).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Show Grid Lines' }));
    expect(screen.getByRole('button', { name: 'Show Eyeline Guide' })).toBeEnabled();
  });

  test('enabling eyeline renders the eyeline overlay', () => {
    const { container } = renderEditorPage();
    fireEvent.click(screen.getByRole('button', { name: 'Show Grid Lines' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show Eyeline Guide' }));
    const eyeline = container.querySelector('.editor-page__eyeline-overlay');
    expect(eyeline).toBeInTheDocument();
    expect(eyeline).toHaveAttribute('aria-hidden', 'true');
  });

  test('toggling grid off removes overlays', () => {
    const { container } = renderEditorPage();
    fireEvent.click(screen.getByRole('button', { name: 'Show Grid Lines' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show Grid Lines' }));
    expect(container.querySelector('.editor-page__grid-overlay')).not.toBeInTheDocument();
  });
});
