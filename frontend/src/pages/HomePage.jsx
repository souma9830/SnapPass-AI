import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

import {
  Upload,
  Sparkles,
  Settings2,
  Download,
} from "lucide-react";

/**
 * HomePage — landing page with hero section and feature highlights.
 */
function HomePage() {
  const features = [
    {
      icon: 'bg-remove',
      title: 'AI Background Removal',
      desc: 'Remove any background instantly with rembg — no manual selection needed.',
      image: '/f-1.png',
      tag: 'AI Powered',
    },
    {
      icon: 'face-center',
      title: 'Auto Face Centering',
      desc: 'OpenCV detects and centers your face to meet passport photo guidelines.',
      image: '/f-2.png',
      tag: 'OpenCV',
    },
    {
      icon: 'sizes',
      title: 'Standard Size Presets',
      desc: 'India, USA, UK, Schengen and more — pick a preset and we handle the DPI.',
      image: '/f-3.png',
      tag: 'Multiple Formats',
    },
    {
      icon: 'print',
      title: 'A4 Print Layout',
      desc: 'Generate a printable A4 sheet with multiple photos — save on printing costs.',
      image: '/f-4.png',
      tag: 'Print Ready',
    },
  ];

  const steps = [
    { label: 'Upload your photo', icon: <Upload size={22} />, subtitle: 'Choose a photo from your device' },
    { label: 'AI processes & centers', icon: <Sparkles size={22} />, subtitle: 'Advanced AI optimization for your photo' },
    { label: 'Choose size & quantity', icon: <Settings2 size={22} />, subtitle: 'Select your required photo format and copies' },
    { label: 'Download & print', icon: <Download size={22} />, subtitle: 'Get a high-quality print-ready photo instantly' },
  ];

  const chips = [
    { icon: 'spark', label: 'Background Removed' },
    { icon: 'target', label: 'Auto Centered' },
    { icon: 'printer', label: 'Print Ready' },
  ];

  const iconMap = {
    spark: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3l1.9 5.7L19 11l-5.1 2.3L12 19l-1.9-5.7L5 11l5.1-2.3L12 3z" />
      </svg>
    ),
    target: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
    printer: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 8V4h10v4" />
        <rect x="5" y="9" width="14" height="8" rx="2" />
        <path d="M7 17v3h10v-3" />
        <path d="M8.5 13.5h7" />
      </svg>
    ),
    'bg-remove': (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M7 14l3-3 3 3 4-5" />
        <path d="M8 8h3" />
      </svg>
    ),
    'face-center': (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="10" r="2" />
        <path d="M8.5 16c1-2 6-2 7 0" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
    sizes: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="5" width="8" height="12" rx="2" />
        <rect x="12" y="7" width="8" height="12" rx="2" />
        <path d="M7 9h2M7 12h2M15 11h2M15 14h2" />
      </svg>
    ),
    print: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 9V4h12v5" />
        <rect x="4" y="10" width="16" height="7" rx="2" />
        <path d="M7 17v3h10v-3" />
        <path d="M9 13h6" />
      </svg>
    ),
  };

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
              Upload Your Photo
            </Link>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__photo-mock">
            <div className="hero__photo-frame" />
            <div className="hero__photo-frame" />
            <div className="hero__photo-frame" />
            <div className="hero__photo-frame" />
          </div>
          <span className="hero__ai-badge"> AI Processed</span>
        </div>
      </section>

      {/* ── Showcase Section ── */}
      <section
        className="ai-showcase"
        aria-labelledby="ai-showcase-title"
      >

        {/* left  text */}
        <div className="ai-showcase__content">

          <span className="badge badge-blue">
            AI Powered Workflow
          </span>

          <h2
            id="ai-showcase-title"
            className="section-title"
          >
            From Simple Upload
            <br />
            to Print-Ready Sheet
          </h2>

          <p className="section-subtitle">
            Upload a portrait photo and let AI automatically remove the background,
            align your face and generate a professional passport photo sheet.
          </p>

          {/* feature */}
          <div className="ai-showcase__chips">
            {chips.map(({ icon, label }) => (
              <div key={label} className="ai-chip">
                <span className="ai-chip__icon" aria-hidden="true">
                  {iconMap[icon]}
                </span>
                {label}
              </div>
            ))}
          </div>

        </div>

        {/* images */}
        <div className="ai-showcase__visual">

          {/* original */}
          <div className="showcase-photo-card">
            <img
              src="/before.png"
              alt="Uploaded portrait"
              className="showcase-photo-card__image"
            />
          </div>

          {/* print sheet */}
          <div className="showcase-sheet-card">

            <img
              src="/after.png"
              alt="Printable passport sheet"
              className="showcase-sheet-card__image"
            />

            <div className="showcase-sheet-card__badge">
              Print Ready
            </div>

          </div>

        </div>

      </section>

      {/* ── How it Works ── */}
      <section className="steps-section" aria-labelledby="steps-title">
        <h2 id="steps-title" className="section-title text-center">How It Works</h2>
        <p className="section-subtitle text-center">Four simple steps to a print-ready sheet</p>
        <div className="steps-grid">
          {steps.map(({ label, icon, subtitle }) => (
            <div key={label} className="step-card">
              <span className="step-card__icon">{icon}</span>
              <div className="step-card__content">
                <p className="step-card__label">{label}</p>
                <p className="step-card__subtitle">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section" aria-labelledby="features-title">
        <h2 id="features-title" className="section-title text-center">Features</h2>
        <p className="section-subtitle text-center">Everything you need right out of the box</p>
        <div className="features-grid">
          {features.map(({ icon, title, desc, image, tag }) => (
            <div key={title} className="feature-card card">

              <div className="feature-card__preview">

                <img
                  src={image}
                  alt={title}
                  className="feature-card__image"
                  loading="lazy"
                />

                <span className="feature-card__tag">
                  {tag}
                </span>

              </div>

              <span className="feature-card__icon" aria-hidden="true">
                {iconMap[icon]}
              </span>

              <h3 className="feature-card__title">
                {title}
              </h3>

              <p className="feature-card__desc">
                {desc}
              </p>

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
