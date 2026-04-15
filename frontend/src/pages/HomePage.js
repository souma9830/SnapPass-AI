import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/**
 * HomePage — landing page with hero section and feature highlights.
 */
function HomePage() {
  const features = [
    { icon: '🧠', title: 'AI Background Removal', desc: 'Remove any background instantly with rembg — no manual selection needed.' },
    { icon: '👤', title: 'Auto Face Centering', desc: 'OpenCV detects and centers your face to meet passport photo guidelines.' },
    { icon: '📐', title: 'Standard Size Presets', desc: 'India, USA, UK, Schengen and more — pick a preset and we handle the DPI.' },
    { icon: '🖨️', title: 'A4 Print Layout', desc: 'Generate a printable A4 sheet with multiple photos — save on printing costs.' },
  ];

  const steps = [
    { num: '01', label: 'Upload your photo' },
    { num: '02', label: 'AI processes & centers' },
    { num: '03', label: 'Choose size & quantity' },
    { num: '04', label: 'Download & print' },
  ];

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <span className="badge badge-blue">Open Source · Free to Use</span>
          <h1 id="hero-title" className="hero__title">
            Passport Photos,<br />
            <span className="hero__title-highlight">Powered by AI</span>
          </h1>
          <p className="hero__subtitle">
            Upload once. Get a perfectly centred, background-removed, print-ready
            passport photo sheet in seconds.
          </p>
          <div className="hero__actions">
            <Link to="/upload" className="btn btn-primary hero__btn-primary">
              📤 Upload Your Photo
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__photo-mock">
            <div className="hero__photo-frame" />
            <div className="hero__photo-frame" />
            <div className="hero__photo-frame" />
            <div className="hero__photo-frame" />
          </div>
          <span className="hero__ai-badge">✨ AI Processed</span>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="steps-section" aria-labelledby="steps-title">
        <h2 id="steps-title" className="section-title text-center">How It Works</h2>
        <p className="section-subtitle text-center">Four simple steps to a print-ready sheet</p>
        <div className="steps-grid">
          {steps.map(({ num, label }) => (
            <div key={num} className="step-card">
              <span className="step-card__num">{num}</span>
              <p className="step-card__label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section" aria-labelledby="features-title">
        <h2 id="features-title" className="section-title text-center">Features</h2>
        <p className="section-subtitle text-center">Everything you need right out of the box</p>
        <div className="features-grid">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card card">
              <span className="feature-card__icon" aria-hidden="true">{icon}</span>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner" aria-label="Call to action">
        <div className="cta-banner__inner">
          <h2 className="cta-banner__title">Ready to generate your passport photo?</h2>
          <p className="cta-banner__subtitle">No account required. Completely free and open-source.</p>
          <Link to="/upload" className="btn btn-primary">Get Started →</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
