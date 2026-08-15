import React from 'react';
import { motion } from 'framer-motion';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './PrivacyPage.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const PrivacyPage = () => {
    const { language } = useLanguage();
    useDocumentMeta({ title: 'Privacy Policy', description: 'SnapPass AI privacy policy - how we handle your photos and data.' });
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
        <div className="privacy-page page-content">
            <motion.div
                className="privacy-page__header"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
            >
                <h1 className="section-title">{t.privacyPolicy}</h1>
                <p className="section-subtitle">{t.privacySubtitle}</p>
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
                    <h2>{t.privacyIntroTitle}</h2>
                    <p>
                        {t.privacyIntroText}
                    </p>

                    <h2>{t.privacyDataTitle}</h2>
                    <p>
                        {t.privacyDataText}
                    </p>
                    <ul>
                        <li>
                            <strong>{t.imagesLabel}</strong> {t.privacyImages}
                        </li>

                        <li>
                            <strong>{t.settingsLabel}</strong> {t.privacySettings}
                        </li>

                        <li>
                            <strong>{t.analyticsLabel}</strong> {t.privacyAnalytics}
                        </li>
                    </ul>

                    <h2>{t.privacyProcessTitle}</h2>
                    <p>
                        {t.privacyProcessText}
                    </p>
                    <ul>
                        <li>{t.privacyProcess1}</li>

                        <li>{t.privacyProcess2}</li>

                        <li>
                            {t.privacyProcess3Part1}
                            <strong>{t.privacyProcess3Highlight}</strong>
                            {t.privacyProcess3Part2}
                        </li>

                        <li>{t.privacyProcess4}</li>
                    </ul>

                    <h2>{t.privacyThirdPartyTitle}</h2>
                    <p>
                        {t.privacyThirdPartyText}
                    </p>

                    <h2>{t.privacyRightsTitle}</h2>

                    <p>{t.privacyRightsText}</p>

                    <p className="privacy-date">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </motion.section>
        </div>
    );
};

export default PrivacyPage;