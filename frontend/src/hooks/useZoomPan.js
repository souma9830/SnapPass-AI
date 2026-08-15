import { useState, useCallback, useRef, useEffect } from 'react';

export default function useZoomPan(initialZoom = 1, minZoom = 0.5, maxZoom = 5) {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const next = Math.min(prev + 0.25, maxZoom);
      return Math.round(next * 100) / 100;
    });
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, minZoom);
      return Math.round(next * 100) / 100;
    });
  }, [minZoom]);

  const resetView = useCallback(() => {
    setZoom(initialZoom);
    setPosition({ x: 0, y: 0 });
  }, [initialZoom]);

  const setZoomLevel = useCallback((level) => {
    const clamped = Math.min(maxZoom, Math.max(minZoom, Number(level)));
    setZoom(Math.round(clamped * 100) / 100);
  }, [minZoom, maxZoom]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => {
      const next = Math.min(maxZoom, Math.max(minZoom, prev + delta));
      return Math.round(next * 100) / 100;
    });
  }, [minZoom, maxZoom]);

  const handleMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [zoom]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => { if (e.ctrlKey || e.metaKey) handleWheel(e); };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [handleWheel]);

  return {
    zoom,
    position,
    containerRef,
    zoomIn,
    zoomOut,
    resetView,
    setZoomLevel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
