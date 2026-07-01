import React from 'react';
import './HomePage.css';
import { motion } from 'framer-motion';

import { Upload, Sparkles, Settings2, Download } from 'lucide-react';
import HeroSection from '../components/HomePage/HeroSection';
import AIShowcaseSection from '../components/HomePage/AIShowcaseSection';
import StepsSection from '../components/HomePage/StepsSection';
import FeaturesSection from '../components/HomePage/FeaturesSection';
import CTABanner from '../components/HomePage/CTABanner';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import SEOMetadata from '../components/layout/SEOMetadata';

/**
 * HomePage — landing page with hero section and feature highlights.
 */
function HomePage({ darkMode, toggleTheme }) {
  const { language } = useLanguage();
  const t = translations[language];
  const featureCards = [
    {
      icon: 'bg-remove',
      title: t.aiBackgroundRemoval,
      desc: t.aiBackgroundRemovalDesc,
      image: '/f-1.png',
      tag: t.aiPowered,
    },
    {
      icon: 'face-center',
      title: t.autoFaceCentering,
      desc: t.autoFaceCenteringDesc,
      image: '/f-2.png',
      tag: t.openCV,
    },
    {
      icon: 'sizes',
      title: t.standardSizePresets,
      desc: t.standardSizePresetsDesc,
      image: '/f-3.png',
      tag: t.multipleFormats,
    },
    {
      icon: 'compare',
      title: 'Passport Requirement Comparator',
      desc: 'Compare passport and visa photo requirements across multiple countries before generating your photo.',
      image: '/f-3.png',
      tag: 'Compare Standards',
      link: '/compare-requirements',
    },
    {
      icon: 'print',
      title: t.a4PrintLayout,
      desc: t.a4PrintLayoutDesc,
      image: '/f-4.png',
      tag: t.printReady,
    },
  ];

  const steps = [
    {
      label: t.stepUpload,
      icon: <Upload size={22} />,
      subtitle: t.stepUploadSubtitle,
    },
    {
      label: t.stepAIProcess,
      icon: <Sparkles size={22} />,
      subtitle: t.stepAIProcessSubtitle,
    },
    {
      label: t.stepChooseSize,
      icon: <Settings2 size={22} />,
      subtitle: t.stepChooseSizeSubtitle,
    },
    {
      label: t.stepDownload,
      icon: <Download size={22} />,
      subtitle: t.stepDownloadSubtitle,
    },
  ];

  const chips = [
    { icon: 'spark', label: t.backgroundRemoved },
    { icon: 'target', label: t.autoCentered },
    { icon: 'printer', label: t.printReady },
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
    compare: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 6h7v5H4z" />
        <path d="M13 6h7v5h-7z" />
        <path d="M4 13h7v5H4z" />
        <path d="M13 13h7v5h-7z" />
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
    <div>
      <SEOMetadata 
        title="AI-Powered Passport Photo Studio" 
        description="Generate professional, standard-compliant passport photos in seconds using AI background removal and face centering."
      />
      <HeroSection darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* ── Showcase Section ── */}
      <AIShowcaseSection
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        chips={chips}
        iconMap={iconMap}
      />

      {/* ── How it Works ── */}
      <StepsSection
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        steps={steps}
      />

      {/* ── Features ── */}
      <FeaturesSection
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        features={featureCards}
        iconMap={iconMap}
      />

      {/* ── CTA Banner ── */}
      <CTABanner />
      <TestimonialsSection darkMode={darkMode} />
    </div>
  );
}

export default HomePage;
