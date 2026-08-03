import React from 'react';
import { render, screen } from '@testing-library/react';
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

const mockProcessor = (overrides = {}) => {
  imageProcessor.useImageProcessor.mockReturnValue({
    processImage: vi.fn(),
    processedUrl: null,
    isProcessing: false,
    error: null,
    reset: vi.fn(),
    ...overrides,
  });
};

describe('EditorPage preview image alt text', () => {
  test('uses descriptive alt text describing the ready processed state', () => {
    mockProcessor();
    renderEditorPage();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'alt',
      'Processed passport photo preview with compliance overlay'
    );
  });

  test('reflects processing state in the alt text', () => {
    mockProcessor({ isProcessing: true });
    renderEditorPage();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'alt',
      'Passport photo preview — processing in progress'
    );
  });

  test('does not use the generic "Preview" alt text', () => {
    mockProcessor();
    renderEditorPage();
    expect(screen.getByRole('img')).not.toHaveAttribute('alt', 'Preview');
  });
});
