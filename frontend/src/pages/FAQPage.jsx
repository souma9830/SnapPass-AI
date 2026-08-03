import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './FAQPage.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const faqItems = [
  {
    q: 'How do I upload a photo?',
    a: 'Go to the Upload page and select your image using drag-and-drop or the file picker. The photo is processed locally before any AI step.',
    qHi: 'मैं फोटो कैसे अपलोड करूं?',
    aHi: 'अपलोड पेज पर जाएं और ड्रैग-एंड-ड्रॉप या फाइल पिकर का उपयोग करके अपनी छवि चुनें। किसी भी AI चरण से पहले फोटो स्थानीय रूप से प्रोसेस की जाती है।',
  },
  {
    q: 'Are my photos stored on your servers?',
    a: 'No. SnapPass AI focuses on privacy — uploaded images are processed for your session and are not permanently stored.',
    qHi: 'क्या मेरी फोटो आपके सर्वर पर संग्रहीत होती हैं?',
    aHi: 'नहीं। SnapPass AI गोपनीयता पर केंद्रित है — अपलोड की गई छवियां आपके सत्र के लिए प्रोसेस होती हैं और स्थायी रूप से संग्रहीत नहीं होती हैं।',
  },
  {
    q: 'Which image formats are supported?',
    a: 'SnapPass AI supports JPG, JPEG, PNG, and WEBP image formats.',
    qHi: 'कौन से छवि प्रारूप समर्थित हैं?',
    aHi: 'SnapPass AI JPG, JPEG, PNG और WEBP छवि प्रारूपों का समर्थन करता है।',
  },
  {
    q: 'What passport photo sizes can I generate?',
    a: 'We support size presets for many countries and document types, including the common 35x45 mm standard and the US 2x2 inch size. You can pick a preset from the size selector.',
    qHi: 'मैं कौन से पासपोर्ट फोटो आकार बना सकता हूं?',
    aHi: 'हम कई देशों और दस्तावेज़ प्रकारों के लिए आकार प्रीसेट का समर्थन करते हैं, जिसमें सामान्य 35x45 मिमी मानक और अमेरिकी 2x2 इंच आकार शामिल हैं। आप साइज़ सेलेक्टर से प्रीसेट चुन सकते हैं।',
  },
  {
    q: 'Can the AI remove the background automatically?',
    a: 'Yes. AI-powered processing removes and replaces the background automatically, and you can pick a solid color like white or blue afterwards.',
    qHi: 'क्या AI बैकग्राउंड स्वचालित रूप से हटा सकता है?',
    aHi: 'हां। AI-संचालित प्रोसेसिंग बैकग्राउंड को स्वचालित रूप से हटाती और बदलती है, और आप बाद में सफेद या नीला जैसा सॉलिड रंग चुन सकते हैं।',
  },
  {
    q: 'What makes a good passport photo?',
    a: 'A clear front-facing face, proper lighting, neutral expression, centered positioning, and a plain background.',
    qHi: 'अच्छी पासपोर्ट फोटो क्या होती है?',
    aHi: 'स्पष्ट सामने से दिखने वाला चेहरा, उचित रोशनी, सामान्य भाव, केंद्रित स्थिति और सादी पृष्ठभूमि।',
  },
  {
    q: 'Can I print the final sheet at home?',
    a: 'Yes. The Print Preview page generates an A4 sheet with multiple copies, and you can export it as a PDF at 150/300/600 DPI.',
    qHi: 'क्या मैं अंतिम शीट घर पर प्रिंट कर सकता हूं?',
    aHi: 'हां। प्रिंट प्रीव्यू पेज कई प्रतियों के साथ A4 शीट बनाता है, और आप इसे 150/300/600 DPI पर PDF के रूप में निर्यात कर सकते हैं।',
  },
  {
    q: 'Does SnapPass AI work offline?',
    a: 'Yes. Offline sync and local draft caching (IndexedDB) keep your edits preserved even when disconnected.',
    qHi: 'क्या SnapPass AI ऑफ़लाइन काम करता है?',
    aHi: 'हां। ऑफ़लाइन सिंक और स्थानीय ड्राफ्ट कैशिंग (IndexedDB) कनेक्ट न होने पर भी आपके संपादन सुरक्षित रखते हैं।',
  },
];

const FAQPage = ({ darkMode }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const isHindi = language === 'hi';
  const [openIndex, setOpenIndex] = useState(0);

  useDocumentMeta({
    title: 'FAQ',
    description: 'Frequently asked questions about SnapPass AI.',
  });

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay },
    }),
  };

  return (
    <div className={`faq-page page-content ${darkMode ? 'dark-mode' : ''}`}>
      <motion.div
        className="faq-page__header"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h1 className="section-title">{t.faqTitle}</h1>
        <p className="section-subtitle">{t.faqSubtitle}</p>
      </motion.div>

      <motion.div
        className="faq-page__list card"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.2}
      >
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} key={item.q}>
              <button
                className="faq-item__question"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-question-${index}`}
              >
                <span>{isHindi ? item.qHi : item.q}</span>
                <ChevronDown
                  className="faq-item__chevron"
                  size={20}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    className="faq-item__answer"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <p>{isHindi ? item.aHi : item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FAQPage;
