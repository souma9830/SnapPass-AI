import api from './api';

const CANDIDATE_PORTS = [3000, 3001, 3002, 5000, 5005, 8080];
let isScanning = false;

/**
 * Probes a specific port to see if a SnapPass backend is running there.
 */
async function probePort(port) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000);

  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && (data.service === 'snappass-backend' || data.service?.toLowerCase().includes('snappass'))) {
      return port;
    }
  } catch (err) {
    // Port not open or request failed
  } finally {
    clearTimeout(timeoutId);
  }
  return null;
}

/**
 * Scans candidate ports to locate a running backend instance.
 * Updates the Axios baseURL and returns the working port, or null.
 */
export async function scanBackendPorts() {
  if (isScanning) return null;
  isScanning = true;

  try {
    // Run probes in parallel for fast discovery
    const probes = CANDIDATE_PORTS.map(port => probePort(port));
    const results = await Promise.all(probes);
    const activePort = results.find(port => port !== null);

    if (activePort) {
      const newUrl = `http://localhost:${activePort}/api`;
      api.defaults.baseURL = newUrl;
      sessionStorage.setItem('snappass_backend_port', activePort.toString());
      console.log(`[SnapPass Sync] Backend auto-discovered on port ${activePort}. API Base URL updated to: ${newUrl}`);
      return activePort;
    }
  } catch (error) {
    console.error('[SnapPass Sync] Error scanning ports:', error);
  } finally {
    isScanning = false;
  }
  return null;
}

/**
 * Gets the initially configured API base URL, honoring any active port overrides.
 */
export function getInitialBaseUrl() {
  const isDev = Boolean(import.meta?.env?.DEV);
  if (isDev) {
    const savedPort = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('snappass_backend_port') : null;
    if (savedPort) {
      return `http://localhost:${savedPort}/api`;
    }
  }
  return import.meta?.env?.VITE_API_URL ?? (isDev ? 'http://localhost:3001/api' : '/api');
}
