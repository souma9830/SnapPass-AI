import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";

const CTABanner = () => {
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
          <h2 className="cta-banner__title">
            Ready to generate your passport photo?
          </h2>
          <p className="cta-banner__subtitle">
            No account required. Completely free and open-source.
          </p>
          <Link to="/upload" className="btn btn-primary">
            Get Started →
          </Link>
        </div>
      </motion.section>
  );
};

export default CTABanner;
