import React from 'react';
import { motion } from 'framer-motion';
import './TermsPage.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const TermsPage = () => {
    const { language } = useLanguage();
    const t = translations[language];
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
                <h1 className="section-title">{t.termsTitle}</h1>
                <p className="section-subtitle">{t.termsSubtitle}</p>
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
                    <h2>{t.termsIntroTitle}</h2>
                    <p>{t.termsIntroText}</p>

                    <h2>{t.termsPrivacyTitle}</h2>
                    <p>{t.termsPrivacyText}</p>
                    <ul>
                        <li>{t.termsPrivacyPoint1}</li>
                        <li>{t.termsPrivacyPoint2}</li>
                        <li>{t.termsPrivacyPoint3}</li>
                    </ul>

                    <h2>{t.termsUseTitle}</h2>
                    <p>{t.termsUseText}</p>
                    <ul>
                        <li>{t.termsUsePoint1}</li>
                        <li>{t.termsUsePoint2}</li>
                        <li>{t.termsUsePoint3}</li>
                    </ul>

                    <h2>{t.termsOpenSourceTitle}</h2>
                    <p>{t.termsOpenSourceText}</p>

                    <h2>{t.termsChangesTitle}</h2>
                    <p>{t.termsChangesText}</p>

                    <p className="terms-date">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </motion.section>
        </div>
    );
};

export default TermsPage;