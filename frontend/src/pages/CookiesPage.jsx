import React from 'react';
import { motion } from 'framer-motion';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './CookiesPage.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const CookiesPage = () => {
    const { language } = useLanguage();
    useDocumentMeta({ title: 'Cookies Policy', description: 'SnapPass AI cookies policy - how we use cookies and how you can manage them.' });
    const t = translations[language];
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay }
        })
    };

    const cookieTypes = [
        { title: t.cookiesEssential, text: t.cookiesEssentialText },
        { title: t.cookiesFunctional, text: t.cookiesFunctionalText },
        { title: t.cookiesAnalytics, text: t.cookiesAnalyticsText },
    ];

    return (
        <div className="cookies-page page-content">
            <motion.div
                className="cookies-page__header"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
            >
                <h1 className="section-title">{t.cookiesTitle}</h1>
                <p className="section-subtitle">{t.cookiesSubtitle}</p>
            </motion.div>

            <motion.section
                className="cookies-page__content card"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
            >
                <div className="cookies-text">
                    <h2>{t.cookiesIntroTitle}</h2>
                    <p>{t.cookiesIntroText}</p>

                    <h2>{t.cookiesTypesTitle}</h2>
                    {cookieTypes.map((type) => (
                        <div className="cookies-type" key={type.title}>
                            <h3>{type.title}</h3>
                            <p>{type.text}</p>
                        </div>
                    ))}

                    <h2>{t.cookiesRetentionTitle}</h2>
                    <p>{t.cookiesRetentionText}</p>

                    <h2>{t.cookiesManageTitle}</h2>
                    <p>{t.cookiesManageText}</p>

                    <h2>{t.cookiesContactTitle}</h2>
                    <p>{t.cookiesContactText}</p>
                </div>
            </motion.section>
        </div>
    );
};

export default CookiesPage;
