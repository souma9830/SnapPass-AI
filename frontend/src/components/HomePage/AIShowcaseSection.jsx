import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";

const AIShowcaseSection = ({ chips, iconMap }) => {
  return (
    <section className="ai-showcase" aria-labelledby="ai-showcase-title">
      {/* left  text */}
      <motion.div
        className="ai-showcase__content"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0.1}
      >
        <span className="badge badge-blue">AI Powered Workflow</span>

        <h2 id="ai-showcase-title" className="section-title">
          From Simple Upload
          <br />
          to Print-Ready Sheet
        </h2>

        <p className="section-subtitle">
          Upload a portrait photo and let AI automatically remove the
          background, align your face and generate a professional passport photo
          sheet.
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
          <div className="showcase-sheet-card__badge">Print Ready</div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;
