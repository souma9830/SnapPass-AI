import React, { useEffect, useRef } from 'react';
import './PremiumCursor.css';

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])';

function PremiumCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const canUseFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!canUseFinePointer || prefersReducedMotion) {
      document.body.classList.remove('premium-cursor-enabled');
      return undefined;
    }

    document.body.classList.add('premium-cursor-enabled');

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const trails = trailRefs.current;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frameId;

    const moveCursor = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      cursor?.style.setProperty('--cursor-x', `${pointerX}px`);
      cursor?.style.setProperty('--cursor-y', `${pointerY}px`);
    };

    const updateInteractiveState = (event) => {
      const isInteractive = Boolean(event.target.closest(INTERACTIVE_SELECTOR));
      document.body.classList.toggle('premium-cursor-interactive', isInteractive);
    };

    const handlePointerDown = () => {
      document.body.classList.add('premium-cursor-pressed');
    };

    const handlePointerUp = () => {
      document.body.classList.remove('premium-cursor-pressed');
    };

    const animate = () => {
      ringX += (pointerX - ringX) * 0.2;
      ringY += (pointerY - ringY) * 0.2;

      ring?.style.setProperty('--cursor-x', `${ringX}px`);
      ring?.style.setProperty('--cursor-y', `${ringY}px`);

      trails.forEach((trail, index) => {
        const delay = (index + 1) * 0.055;
        const trailX = ringX + (pointerX - ringX) * delay;
        const trailY = ringY + (pointerY - ringY) * delay;

        trail?.style.setProperty('--cursor-x', `${trailX}px`);
        trail?.style.setProperty('--cursor-y', `${trailY}px`);
      });

      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', moveCursor);
    window.addEventListener('pointerover', updateInteractiveState);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    frameId = window.requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove(
        'premium-cursor-enabled',
        'premium-cursor-interactive',
        'premium-cursor-pressed'
      );
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('pointerover', updateInteractiveState);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="premium-cursor" aria-hidden="true">
      <span className="premium-cursor__ring" ref={ringRef} />
      <span className="premium-cursor__dot" ref={cursorRef} />
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <span
          key={item}
          className="premium-cursor__trail"
          ref={(node) => {
            trailRefs.current[item] = node;
          }}
          style={{
            '--trail-size': `${16 - item * 1.4}px`,
            '--trail-hue': 195 + item * 24,
            '--trail-opacity': 0.5 - item * 0.055,
          }}
        />
      ))}
    </div>
  );
}

export default PremiumCursor;
