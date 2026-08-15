export async function initializeCameraStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('WEBRTC_UNSUPPORTED');
  }
  return await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
}
