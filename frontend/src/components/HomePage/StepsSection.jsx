import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";


const StepsSection = ({ darkMode, toggleTheme, steps }) => {
  return (

    <div className={`steps-toggle ${darkMode? "steps-toggle-dark": ""}`} aria-labelledby="steps-title">
    <section className="steps-section" aria-labelledby="steps-title">
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h2 id="steps-title" className={`section-title ${darkMode? 'section-title-dark': 'section-title-light'}`}>
          How It Works
        </h2>
        <p className={`section-subtitle ${  darkMode ? 'section-subtitle-dark' : ''}`}>
          Four simple steps to a print-ready sheet
        </p>
      </motion.div>

      <div className="steps-grid">
        {steps.map(({ label, icon, subtitle }, idx) => (
          <motion.div
            key={label}
            className="step-card  "
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={idx * 0.15}
          >
            <span className={`step-card__icon ${darkMode? 'step-card__icon-dark': ''}`}>{icon}</span>
            <div className="step-card__content">
              <p className={`step-card__label ${darkMode? 'step-card__label-dark': ''}`}>{label}</p>
              <p className={`step-card__subtitle ${darkMode? 'step-card__subtitle-dark': ''}`}>{subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default StepsSection;
