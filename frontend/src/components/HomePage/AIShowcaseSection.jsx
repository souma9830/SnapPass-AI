import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";

const AIShowcaseSection = ({ darkMode, toggleTheme, chips, iconMap }) => {
  return (
    <div className={`ai-showcase-toggle ${ darkMode? "ai-showcase-toggle-dark": "" }`}>
    <section className= "ai-showcase" aria-labelledby="ai-showcase-title">
      {/* left  text */}
      <motion.div
        className="ai-showcase__content"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0.1}
      >
        <span className={`badge ${darkMode?"badge-blue-dark": "badge-blue"}`}> </span>

        <h2 id="ai-showcase-title" className={`section-title ${darkMode? "section-title-dark": "section-title-light"}`}>
          From Simple Upload
          <br />
          to Print-Ready Sheet
        </h2>

        <p className={`section-subtitle ${darkMode? "section-subtitle-dark": "section-subtitle-light"}`}>
          Upload a portrait photo and let AI automatically remove the
          background, align your face and generate a professional passport photo
          sheet.
        </p>

        {/* feature */}
        <div className="ai-showcase__chips">
          {chips.map(({ icon, label }) => (
            <div key={label} className={`ai-chip ${darkMode ? "ai-chip-dark" : "ai-chip-light"}`}>
              <span className={`ai-chip__icon ${darkMode ? "ai-chip__icon-dark" : "ai-chip__icon-light"}`} aria-hidden="true">
                {iconMap[icon]}
              </span>
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* images */}
      <div className="ai-showcase__visual">
        {/* original */}
        <motion.div
          className="showcase-photo-card"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          <img
            src="/before.png"
            alt="Uploaded portrait"
            className="showcase-photo-card__image"
          />
        </motion.div>

        {/* print sheet */}
        <motion.div
          className="showcase-sheet-card"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          <img
            src="/after.png"
            alt="Printable passport sheet"
            className="showcase-sheet-card__image"
          />
          <div className={`showcase-sheet-card__badge ${darkMode ? "showcase-sheet-card__badge-dark" : "showcase-sheet-card__badge-light"}`}>
            Print Ready
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
};

export default AIShowcaseSection;
