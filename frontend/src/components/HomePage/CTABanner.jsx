import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUpVariant } from '../../animations/variants.js';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const CTABanner = ({ darkMode }) => {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <motion.section
      className="cta-banner"
      aria-label="Call to action"
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0.1}
    >
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">{t.ctaTitle}</h2>
        <p className="cta-banner__subtitle">{t.ctaSubtitle}</p>
        <Link to="/upload" className="btn btn-primary">
          {t.ctaButton}
        </Link>
      </div>
    </motion.section>
  );
};

export default CTABanner;
