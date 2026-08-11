import React, { useRef, useEffect, useState } from 'react';
import { drawFaceGuideOval } from '../utils/liveFaceCanvasUtils';
import '../styles/webcamFaceAligner.css';

const WebcamFaceAligner = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAligned, setIsAligned] = useState(false);

  useEffect(() => {
    let stream = null;
    navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('[Webcam] Access denied:', err));

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      drawFaceGuideOval(canvasRef.current, isAligned);
    }
  }, [isAligned]);

  return (
    <div className="webcam-aligner-container">
      <video ref={videoRef} autoPlay playsInline className="webcam-video-feed" />
      <canvas ref={canvasRef} width={640} height={480} className="webcam-canvas-overlay" />
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 z-10">
        <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white text-xs rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

export default WebcamFaceAligner;
