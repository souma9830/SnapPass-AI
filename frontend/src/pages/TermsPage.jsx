import React from 'react';
import { motion } from 'framer-motion';
import './TermsPage.css';

const TermsPage = () => {
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay }
        })
    };

    return (
        <div className="terms-page page-content">
            <motion.div
                className="terms-page__header"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
            >
                <h1 className="section-title">Terms & Conditions</h1>
                <p className="section-subtitle">Please read these terms carefully before using SnapPass AI.</p>
            </motion.div>

            <motion.section
                className="terms-page__content card"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
            >
                <div className="terms-text">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to SnapPass AI. By accessing or using our open-source passport photo generator, you agree to be bound by these Terms and Conditions. SnapPass AI is a free tool designed to process portraits and generate print-ready photo sheets.
                    </p>

                    <h2>2. Privacy & Data Processing</h2>
                    <p>
                        SnapPass AI relies on automated AI processing (including background removal and face centering). When you upload a photo:
                    </p>
                    <ul>
                        <li>Your photo is sent to our servers solely for the purpose of AI processing.</li>
                        <li>We do not permanently store, share, or claim ownership of your uploaded photos.</li>
                        <li>Files are temporarily held in memory or transient storage during processing and are immediately discarded after the print-ready sheet is generated.</li>
                    </ul>

                    <h2>3. Acceptable Use</h2>
                    <p>
                        You agree to use SnapPass AI only for its intended purpose. You may not:
                    </p>
                    <ul>
                        <li>Upload inappropriate, illegal, or offensive images.</li>
                        <li>Abuse, bypass, or overload the API and processing endpoints.</li>
                        <li>Use the generated photos for fraudulent identification purposes. SnapPass AI cannot guarantee that generated photos will be accepted by all government or official agencies. It is your responsibility to verify the specific requirements of your application.</li>
                    </ul>

                    <h2>4. Open Source Disclaimer</h2>
                    <p>
                        SnapPass AI is an open-source project provided "as is", without warranty of any kind, express or implied. The developers and contributors are not liable for any claims, damages, or other liability arising from the use of this software.
                    </p>

                    <h2>5. Changes to Terms</h2>
                    <p>
                        As this project is in active development, these terms may be updated at any time. Continued use of the platform implies acceptance of any revised terms.
                    </p>

                    <p className="terms-date">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </motion.section>
        </div>
    );
};

export default TermsPage;