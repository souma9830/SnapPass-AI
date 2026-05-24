import React from 'react';
import { motion } from 'framer-motion';
import './PrivacyPage.css';

const PrivacyPage = () => {
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay }
        })
    };

    return (
        <div className="privacy-page page-content">
            <motion.div
                className="privacy-page__header"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
            >
                <h1 className="section-title">Privacy Policy</h1>
                <p className="section-subtitle">How we handle your data with transparency and care.</p>
            </motion.div>

            <motion.section
                className="privacy-page__content card"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
            >
                <div className="privacy-text">
                    <h2>1. Introduction</h2>
                    <p>
                        At SnapPass AI, your privacy is our priority. Because our tool deals with personal photographs, we have designed our open-source architecture to be inherently privacy-respecting. This policy explains what data we collect and how it is used.
                    </p>

                    <h2>2. What Data We Collect</h2>
                    <p>
                        When you use SnapPass AI, we collect only the absolute minimum required to provide the service:
                    </p>
                    <ul>
                        <li><strong>Images:</strong> The portrait photo you upload for processing.</li>
                        <li><strong>Settings:</strong> The country standard, size, and background color you select.</li>
                        <li><strong>Analytics:</strong> Anonymous, aggregated usage data (such as page views or error rates) to help us improve the open-source platform. We do not track individual users.</li>
                    </ul>

                    <h2>3. How We Process Your Data (Zero Retention)</h2>
                    <p>
                        SnapPass AI is built on a "Zero Retention" model. Here is exactly what happens to your photo:
                    </p>
                    <ul>
                        <li>Your photo is uploaded directly to our secure processing server (or processed locally if you are running the app yourself).</li>
                        <li>Our AI models analyze the image in memory to remove the background and center your face.</li>
                        <li>Once the final print-ready sheet is generated and downloaded, <strong>your original and processed photos are immediately and permanently deleted from our servers</strong>.</li>
                        <li>We do not use your photos to train our AI models.</li>
                    </ul>

                    <h2>4. Third-Party Services</h2>
                    <p>
                        Because this is an open-source tool, the hosted version may rely on basic infrastructure providers (like Vercel or standard cloud hosting). These providers handle secure data transit (HTTPS) but do not have access to store or view your personal photos during our automated processing.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        Because we do not store your personal data, there is no account to delete or personal archive to request. If you have concerns about the open-source code or how data is routed, you are welcome to audit our public repository or self-host your own instance of SnapPass AI.
                    </p>

                    <p className="privacy-date">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </motion.section>
        </div>
    );
};

export default PrivacyPage;