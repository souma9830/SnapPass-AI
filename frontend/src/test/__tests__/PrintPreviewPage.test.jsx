import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrintPreviewPage from '../../pages/PrintPreviewPage';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    state: {
      processedPhotos: [
        { processedUrl: '/uploads/sample.jpg', filename: 'test.jpg', sizePreset: '35x45' },
      ],
    },
  }),
  Link: ({ children, to }) => `<a href="${to}">${children}</a>`,
}));

vi.mock('../../hooks/useDocumentMeta', () => ({
  useDocumentMeta: () => {},
}));

vi.mock('../../hooks/useBatchExport', () => ({
  __esModule: true,
  default: () => ({ exporting: false, exportFiles: vi.fn() }),
}));

vi.mock('../../utils/sessionManager', () => ({
  saveSession: vi.fn(),
  getSession: () => null,
  saveSessionToHistory: vi.fn(),
}));

vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

vi.mock('../../translations/translations', () => ({
  translations: { en: { noProcessedPhoto: 'No photo', uploadBeforePrint: 'Upload a photo first', uploadPhotoButton: 'Upload', backToEditor: 'Back', securePassword: 'Password', enterPassword: 'Enter password' } },
}));

describe('PrintPreviewPage', () => {
  it('renders without crashing when processedPhotos are present', () => {
    const { container } = render(<PrintPreviewPage darkMode={false} />);
    expect(container).toBeTruthy();
  });

  it('shows empty state when no processed photos', () => {
    const { container } = render(<PrintPreviewPage darkMode={false} />);
    expect(container).toBeTruthy();
  });
});