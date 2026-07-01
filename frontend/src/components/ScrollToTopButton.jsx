import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  const onScroll = () => setVisible(window.scrollY > 300);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button type="button" className="scroll-to-top-btn" onClick={scrollToTop} aria-label="Scroll to top">      ↑
    </button>
  );
}

export default ScrollToTopButton;