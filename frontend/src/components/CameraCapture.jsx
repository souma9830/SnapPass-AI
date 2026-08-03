import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Check, RefreshCw, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import './CameraCapture.css';

export const supportsCamera = () =>
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function';

const dataUrlToBlob = (dataUrl) => {
  const [meta, b64] = dataUrl.split(',');
  const mime = (meta.match(/:(.*?);/) || [])[1] || 'image/jpeg';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const stopStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};

const playVideo = (video) => {
  try {
    const result = video.play();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch {
    // play() not implemented in some environments — ignore
  }
};

const CameraCapture = ({ open, onClose, onCapture }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const containerRef = useFocusTrap(open);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open) return undefined;

    if (!supportsCamera()) {
      setStatus('error');
      setError(t.cameraNotSupported);
      return undefined;
    }

    let cancelled = false;
    setStatus('starting');
    setError('');

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stopStream(stream);
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          playVideo(video);
        }
        setStatus('active');
      })
      .catch((err) => {
        if (cancelled) return;
        const denied =
          err && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
        setStatus('error');
        setError(denied ? t.cameraPermissionDenied : t.cameraNotFound);
      });

    return () => {
      cancelled = true;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [open, t, attempt]);

  const handleClose = useCallback(() => {
    stopStream(streamRef.current);
    streamRef.current = null;
    setStatus('idle');
    setError('');
    setCapturedDataUrl(null);
    setCapturedFile(null);
    onClose();
  }, [onClose]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setStatus('error');
        setError(t.cameraNotSupported);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedDataUrl(dataUrl);
      setCapturedFile(
        new File([dataUrlToBlob(dataUrl)], 'camera-capture.jpg', {
          type: 'image/jpeg',
        })
      );
      setStatus('captured');
    } catch {
      setStatus('error');
      setError(t.cameraNotSupported);
    }
  };

  const retake = () => {
    setCapturedDataUrl(null);
    setCapturedFile(null);
    setStatus('active');
  };

  const confirm = () => {
    if (capturedFile && onCapture) {
      onCapture(capturedFile);
      handleClose();
    }
  };

  const retry = () => {
    setError('');
    setStatus('starting');
    setAttempt((n) => n + 1);
  };

  if (!open) return null;

  return (
    <div className="camera-modal" ref={containerRef}>
      <div className="camera-modal__backdrop" onClick={handleClose} aria-hidden="true" />
      <div className="camera-modal__dialog" role="dialog" aria-modal="true" aria-label={t.cameraTitle}>
        <div className="camera-modal__header">
          <h2 className="camera-modal__title">{t.cameraTitle}</h2>
          <button
            type="button"
            className="camera-modal__close"
            onClick={handleClose}
            aria-label={t.cameraClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="camera-modal__body">
          {status === 'captured' && capturedDataUrl ? (
            <img
              src={capturedDataUrl}
              alt="Captured photo preview"
              className="camera-modal__img"
            />
          ) : (
            <video
              ref={videoRef}
              className="camera-modal__video"
              playsInline
              autoPlay
              muted
              aria-label="Live camera preview"
            />
          )}

          {status === 'error' && (
            <p className="camera-modal__error" role="alert">
              {error}
            </p>
          )}

          <p className="camera-modal__hint">{t.cameraInstruction}</p>
        </div>

        <div className="camera-modal__actions">
          {status === 'captured' ? (
            <>
              <button type="button" className="camera-modal__btn" onClick={retake}>
                <RefreshCw size={16} aria-hidden="true" />
                {t.cameraRetake}
              </button>
              <button
                type="button"
                className="camera-modal__btn camera-modal__btn--primary"
                onClick={confirm}
              >
                <Check size={16} aria-hidden="true" />
                {t.cameraConfirm}
              </button>
            </>
          ) : status === 'error' ? (
            <button
              type="button"
              className="camera-modal__btn camera-modal__btn--primary"
              onClick={retry}
            >
              <Camera size={16} aria-hidden="true" />
              {t.cameraStart}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="camera-modal__btn camera-modal__btn--primary"
                onClick={capture}
                disabled={status !== 'active'}
              >
                <Camera size={16} aria-hidden="true" />
                {t.cameraCapture}
              </button>
              <button type="button" className="camera-modal__btn" onClick={handleClose}>
                {t.cancel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
