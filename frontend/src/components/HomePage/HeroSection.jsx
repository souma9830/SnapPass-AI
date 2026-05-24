import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUpVariant } from "../../animations/variants.js";

const HeroSection = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.div
        className="hero__inner"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0.1}
      >
        <span className="badge badge-blue">Open Source · Free to Use</span>
        <h1 id="hero-title" className="hero__title">
          Passport Photos,
          <br />
          <span className="hero__title-highlight">Powered by AI</span>
        </h1>
        <p className="hero__subtitle">
          Upload once. Get a perfectly centred, background-removed, print-ready
          passport photo sheet in seconds.
        </p>
        <div className="hero__actions">
          <Link to="/upload" className="btn btn-primary hero__btn-primary">
            Upload Your Photo
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
        <div className="hero__photo-mock">
          <div className="hero__photo-frame" />
          <div className="hero__photo-frame" />
          <div className="hero__photo-frame" />
          <div className="hero__photo-frame" />
        </div>
        <span className="hero__ai-badge"> AI Processed</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
