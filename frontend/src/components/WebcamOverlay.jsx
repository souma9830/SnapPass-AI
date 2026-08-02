import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle, CheckCircle2 } from 'lucide-react';

export const WebcamOverlay = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isFaceAligned, setIsFaceAligned] = useState(false);
  const [warningMessage, setWarningMessage] = useState("Please look straight into the camera.");

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate real-time MediaPipe face detection feedback
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, we would run a TF.js / MediaPipe model here on the video frames
      // to check face pitch, yaw, roll, and lighting conditions.
      const simulatedAlignment = Math.random() > 0.5;
      setIsFaceAligned(simulatedAlignment);
      
      if (simulatedAlignment) {
        setWarningMessage("Perfect alignment! Hold still.");
      } else {
        const warnings = ["Face not detected", "Look straight ahead", "Lighting is too dark on one side"];
        setWarningMessage(warnings[Math.floor(Math.random() * warnings.length)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    canvasRef.current.toBlob((blob) => {
      if (blob && onCapture) {
        const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
        onCapture(file);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="webcam-overlay-container" style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ width: '100%', display: 'block', backgroundColor: '#000' }}
      />
      
      {/* Face Guide Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.5)', // Darken edges
      }}>
        <div style={{
          width: '60%',
          height: '70%',
          border: `3px dashed ${isFaceAligned ? '#10b981' : '#ef4444'}`, // Green if good, Red if bad
          borderRadius: '50%',
          boxShadow: `0 0 0 9999px rgba(0,0,0,0.5)` // The mask
        }} />
      </div>

      {/* Real-time Feedback Toast */}
      <div style={{
        position: 'absolute',
        top: '16px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: isFaceAligned ? '#d1fae5' : '#fee2e2',
        color: isFaceAligned ? '#065f46' : '#991b1b',
        padding: '8px 16px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        {isFaceAligned ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        {warningMessage}
      </div>

      <button 
        onClick={takePhoto}
        disabled={!isFaceAligned}
        style={{
          position: 'absolute',
          bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: isFaceAligned ? '#2563eb' : '#94a3b8',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '64px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isFaceAligned ? 'pointer' : 'not-allowed',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s'
        }}
      >
        <Camera size={28} />
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamOverlay;
