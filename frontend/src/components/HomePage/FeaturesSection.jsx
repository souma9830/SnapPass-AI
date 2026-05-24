import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";

const FeaturesSection = ({ features, iconMap }) => {
  return (
    <section className="features-section" aria-labelledby="features-title">
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h2 id="features-title" className="text-center section-title">
          Features
        </h2>
        <p className="text-center section-subtitle">
          Everything you need right out of the box
        </p>
      </motion.div>

      <div className="features-grid">
        {features.map(({ icon, title, desc, image, tag }, idx) => (
          <motion.div
            key={title}
            className="feature-card card"
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
              <span className="feature-card__tag">{tag}</span>
            </div>
            <span className="feature-card__icon" aria-hidden="true">
              {iconMap[icon]}
            </span>
            <h3 className="feature-card__title">{title}</h3>
            <p className="feature-card__desc">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
