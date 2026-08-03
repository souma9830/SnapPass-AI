import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { ToastProvider } from '../../context/ToastContext';

vi.mock('../../hooks/usePhotoUpload', () => ({
  default: () => ({
    uploadFile: vi.fn(),
    uploadedFile: null,
    isUploading: false,
    error: null,
    uploadProgress: 0,
    reset: vi.fn(),
  }),
}));

vi.mock('../../utils/imageDiagnostics', () => ({
  runImageDiagnostics: vi.fn(() => Promise.resolve({ success: true, errors: [], warnings: [] })),
}));

vi.mock('../../utils/imageCompression', () => ({
  compressImage: vi.fn((file) => Promise.resolve(file)),
}));

import UploadPage from '../../pages/UploadPage';

describe('UploadPage camera entry point', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: vi.fn(() => Promise.resolve({ getTracks: () => [] })),
      },
    });
    localStorage.clear();
  });

  it('shows a Take Photo button alongside the upload box', () => {
    render(
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <UploadPage darkMode={false} />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    );
    expect(screen.getByRole('button', { name: 'Take Photo' })).toBeInTheDocument();
  });

  it('opens the camera dialog when Take Photo is clicked', async () => {
    render(
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <UploadPage darkMode={false} />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Take Photo' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
