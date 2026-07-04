import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function useFocusTrap(active = false) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const previouslyFocused = document.activeElement;

    const focusableEls = container.querySelectorAll(FOCUSABLE_SELECTOR);
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    }

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;

      const isShift = e.shiftKey;
      const currentFocusable = Array.from(focusableEls);
      const currentIndex = currentFocusable.indexOf(document.activeElement);

      if (currentIndex === -1) {
        e.preventDefault();
        firstFocusable?.focus();
        return;
      }

      if (isShift && currentIndex === 0) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!isShift && currentIndex === focusableEls.length - 1) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [active]);

  return ref;
}
