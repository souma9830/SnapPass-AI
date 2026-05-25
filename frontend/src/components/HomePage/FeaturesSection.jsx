import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";

const FeaturesSection = ({darkMode, toggleTheme, features, iconMap }) => {
  return (
    <div className={`features-toggle ${darkMode ? 'features-toggle-dark' : ''}`} aria-labelledby="features-title"> 
    <section className="features-section" aria-labelledby="features-title">
      
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h2 id="features-title" className={`section-title ${darkMode ? 'section-title-dark' : ''}`}>
          Features
        </h2>
        <p className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : 'section-subtitle-light'}`}>
          Everything you need right out of the box
        </p>
      </motion.div>

      <div className="features-grid">
        {features.map(({ icon, title, desc, image, tag }, idx) => (
          <motion.div
            key={title}
            className={`feature-card ${darkMode ? 'feature-card-dark' : ''}`}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={idx * 0.15}
          >
            <div className="feature-card__preview">
              <img
                src={image}
                alt={title}
                className="feature-card__image"
                loading="lazy"
              />
              <span className={`feature-card__tag ${darkMode ? 'feature-card__tag-dark' : ''}`}>
                {tag}
              </span>
            </div>
            <span className={`feature-card__icon ${darkMode ? 'feature-card__icon-dark' : ''}`} aria-hidden="true">
              {iconMap[icon]}
            </span>
            <h3 className={`feature-card__title ${darkMode ? 'feature-card__title-dark' : ''}`}>
              {title}
            </h3>
            <p className={`feature-card__desc ${darkMode ? 'feature-card__desc-dark' : ''}`}>
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default FeaturesSection;
