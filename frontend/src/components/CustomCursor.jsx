import React, { useState, useEffect, useCallback } from 'react';
import './CustomCursor.css';

const CURSOR_STORAGE_KEY = 'snappass_cursor_mode';

export const CURSOR_MODES = [
  { id: 'default', label: '🎯 System Default' },
  { id: 'glow', label: '✨ Neon Glow' },
  { id: 'trail', label: '💜 Violet Trail' },
  { id: 'sparkle', label: '⭐ Amber Sparkle' },
  { id: 'orbit', label: '🌸 Orbit Ring' },
];

function CustomCursor() {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(CURSOR_STORAGE_KEY) || 'default';
    } catch {
      return 'default';
    }
  });

  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });

    if (mode === 'trail') {
      setTrail((prev) => [
        { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() },
        ...prev.slice(0, 5),
      ]);
    }

    const target = e.target;
    if (
      target &&
      (target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList?.contains('interactive'))
    ) {
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  }, [mode]);

  const handleMouseLeave = () => setIsVisible(false);
  const handleMouseEnter = () => setIsVisible(true);

  useEffect(() => {
    if (mode === 'default') return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mode, handleMouseMove]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    try {
      localStorage.setItem(CURSOR_STORAGE_KEY, newMode);
    } catch (_) {}
  };

  return (
    <>
      {mode !== 'default' && isVisible && (
        <div
          className={`custom-cursor-pointer cursor-mode-${mode} ${isHovering ? 'cursor-hovering' : ''}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      )}

      {mode === 'trail' &&
        isVisible &&
        trail.map((dot, idx) => (
          <div
            key={dot.id}
            className="cursor-trail-dot"
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              width: `${Math.max(4, 10 - idx * 1.5)}px`,
              height: `${Math.max(4, 10 - idx * 1.5)}px`,
              opacity: 1 - idx * 0.18,
            }}
          />
        ))}

      <div className="cursor-widget-panel" aria-label="Cursor style selector">
        <span>✨ Cursor:</span>
        <select
          className="cursor-widget-select"
          value={mode}
          onChange={(e) => handleModeChange(e.target.value)}
        >
          {CURSOR_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default CustomCursor;
