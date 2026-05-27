import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations/translations";

const HeroSection = ({ darkMode, toggleTheme }) => {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <section className={`home-page ${darkMode ? 'home-page-dark' : 'home-page-light'}`}>

      <div className="hero" aria-labelledby="hero-title">
        <motion.div
          className="hero__inner"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0.1}
        >
          <span className={`badge ${darkMode ? "badge-blue-dark" : "badge-blue"}`}>{t.openSourceFree}</span>
          <h1 id="hero-title" className={`hero__title ${darkMode ? 'hero__title-dark' : 'hero__title-light'}`}>
            {t.heroMainTitle},<br />
            <span className={`hero__title-highlight ${darkMode ? 'hero__title-highlight-dark' : 'hero__title-highlight-light'}`}> {t.heroHighlight}</span>
          </h1>
          <p className={`hero__subtitle ${darkMode ? 'hero__subtitle-dark' : 'hero__subtitle-light'}`} >
            {t.heroDescription}
          </p>
          <div className="hero__actions">
            <Link to="/upload" className={`btn hero__btn-primary ${darkMode ? "btn-primary-dark" : 'btn-primary'}`}>
              {t.uploadPhoto}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          aria-hidden="true"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0.3}
        >
          <div className={`hero__photo-mock ${darkMode ? "hero__photo-mock-dark" : "hero__photo-mock-light"}`}>
            <div className={`hero__photo-frame ${darkMode ? "hero__photo-frame-dark" : "hero__photo-frame-light"}`} />
            <div className={`hero__photo-frame ${darkMode ? "hero__photo-frame-dark" : "hero__photo-frame-light"}`} />
            <div className={`hero__photo-frame ${darkMode ? "hero__photo-frame-dark" : "hero__photo-frame-light"}`} />
            <div className={`hero__photo-frame ${darkMode ? "hero__photo-frame-dark" : "hero__photo-frame-light"}`} />
          </div>
          <span className={`hero__ai-badge ${darkMode ? "hero__ai-badge-dark" : "hero__ai-badge-light"}`}> {t.aiProcessed}</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
