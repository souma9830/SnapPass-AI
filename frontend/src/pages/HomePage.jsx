import React from "react";
import "./HomePage.css";

import HeroSection from "../components/HomePage/HeroSection";
import AIShowcaseSection from "../components/HomePage/AIShowcaseSection";
import StepsSection from "../components/HomePage/StepsSection";
import FeaturesSection from "../components/HomePage/FeaturesSection";
import CTABanner from "../components/HomePage/CTABanner";
import BackToTop from "../components/HomePage/BackToTop";

import { features, steps, chips, iconMap } from "../data/HomePageData";

/**
 * HomePage — landing page with hero section and feature highlights.
 */
function HomePage() {
  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Showcase Section ── */}
      <AIShowcaseSection chips={chips} iconMap={iconMap} />

      {/* ── How it Works ── */}
      <StepsSection steps={steps} />

      {/* ── Features ── */}
      <FeaturesSection features={features} iconMap={iconMap} />

      {/* ── CTA Banner ── */}
      <CTABanner />
      <BackToTop />
    </div>
  );
}

export default HomePage;
