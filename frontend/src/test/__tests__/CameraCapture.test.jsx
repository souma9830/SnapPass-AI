import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import CameraCapture, { supportsCamera } from '../../components/CameraCapture';

const fakeTrack = { stop: vi.fn() };
const fakeStream = { getTracks: () => [fakeTrack] };

const mockGetUserMedia = (impl) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: vi.fn(impl) },
  });
};

const renderModal = (onCapture = vi.fn(), open = true) => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <CameraCapture open={open} onClose={vi.fn()} onCapture={onCapture} />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('CameraCapture', () => {
  beforeEach(() => {
    mockGetUserMedia(() => Promise.resolve(fakeStream));
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: vi.fn(() => Promise.resolve()),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('detects browser camera API support', () => {
    expect(supportsCamera()).toBe(true);
  });

  it('does not render the dialog when closed', () => {
    renderModal(vi.fn(), false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog with camera controls when open', async () => {
    renderModal();
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Capture')).toBeInTheDocument());
  });

  it('shows a friendly message when camera permission is denied', async () => {
    mockGetUserMedia(() => Promise.reject({ name: 'NotAllowedError' }));
    renderModal();
    expect(
      await screen.findByText('Camera permission was denied. Please allow access and try again.')
    ).toBeInTheDocument();
    expect(screen.getByText('Start Camera')).toBeInTheDocument();
  });

  it('shows a message when no camera is found', async () => {
    mockGetUserMedia(() => Promise.reject({ name: 'NotFoundError' }));
    renderModal();
    expect(
      await screen.findByText('No camera was found on this device.')
    ).toBeInTheDocument();
  });

  it('shows a message when camera API is unsupported', async () => {
    delete navigator.mediaDevices;
    renderModal();
    expect(
      await screen.findByText(
        'Camera capture is not supported on this browser or device.'
      )
    ).toBeInTheDocument();
  });

  it('captures a frame and hands the file back through onCapture', async () => {
    const onCapture = vi.fn();
    const { container } = renderModal(onCapture);

    await waitFor(() => expect(screen.getByText('Capture')).toBeInTheDocument());

    const video = container.querySelector('video');
    Object.defineProperty(video, 'videoWidth', { value: 640 });
    Object.defineProperty(video, 'videoHeight', { value: 480 });

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/jpeg;base64,' + btoa('fake-jpeg-bytes')
    );

    fireEvent.click(screen.getByText('Capture'));

    const usePhoto = await screen.findByText('Use Photo');
    expect(screen.getByText('Retake')).toBeInTheDocument();

    fireEvent.click(usePhoto);
    expect(onCapture).toHaveBeenCalledTimes(1);
    const file = onCapture.mock.calls[0][0];
    expect(file).toBeInstanceOf(File);
    expect(file.type).toBe('image/jpeg');
  });

  it('stops the stream when the dialog is closed', async () => {
    const { unmount } = renderModal();
    await waitFor(() => expect(screen.getByText('Capture')).toBeInTheDocument());
    unmount();
    expect(fakeTrack.stop).toHaveBeenCalled();
  });
});
