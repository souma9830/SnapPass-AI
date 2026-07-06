import React from 'react';
import HeroSection from '../components/HomePage/HeroSection';
import FeaturesSection from '../components/HomePage/FeaturesSection';
import StepsSection from '../components/HomePage/StepsSection';
import AIShowcaseSection from '../components/HomePage/AIShowcaseSection';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';
import CTABanner from '../components/HomePage/CTABanner';
import BackToTop from '../components/HomePage/BackToTop';
import { features, steps, chips, iconMap } from '../data/HomePageData';
import './HomePage.css';

function HomePage({ darkMode, toggleTheme }) {
  return (
    <main>
      <HeroSection darkMode={darkMode} toggleTheme={toggleTheme} />
      <AIShowcaseSection
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        chips={chips}
        iconMap={iconMap}
      />
      <StepsSection
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        steps={steps}
      />
      <FeaturesSection
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        features={features}
        iconMap={iconMap}
      />
      <TestimonialsSection darkMode={darkMode} />
      <CTABanner darkMode={darkMode} />
      <BackToTop />
    </main>
  );
}

export default HomePage;
