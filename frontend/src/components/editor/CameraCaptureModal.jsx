import React, { useRef, useEffect } from 'react';
import { initializeCameraStream } from '../../utils/cameraStreamUtil';
import './CameraCaptureModal.css';

export default function CameraCaptureModal({ isOpen, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    let stream;
    initializeCameraStream()
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((e) => console.error(e));

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="camera-modal-backdrop">
      <div className="camera-modal-card">
        <h3>Live Camera Capture</h3>
        <video ref={videoRef} autoPlay playsInline className="camera-video-preview" />
        <button onClick={onClose} className="close-camera-btn">Close</button>
      </div>
    </div>
  );
}
