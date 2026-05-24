import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";


const StepsSection = ({ steps }) => {
  return (
    <section className="steps-section" aria-labelledby="steps-title">
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h2 id="steps-title" className="text-center section-title">
          How It Works
        </h2>
        <p className="text-center section-subtitle">
          Four simple steps to a print-ready sheet
        </p>
      </motion.div>

      <div className="steps-grid">
        {steps.map(({ label, icon, subtitle }, idx) => (
          <motion.div
            key={label}
            className="step-card"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={idx * 0.15}
          >
            <span className="step-card__icon">{icon}</span>
            <div className="step-card__content">
              <p className="step-card__label">{label}</p>
              <p className="step-card__subtitle">{subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
