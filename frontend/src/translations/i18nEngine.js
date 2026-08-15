export const translationsData = {
  en: { upload: 'Upload Photo', print: 'Print Sheet' },
  bn: { upload: 'ছবি আপলোড করুন', print: 'প্রিন্ট শিট' },
  hi: { upload: 'फोटो अपलोड करें', print: 'प्रिंट शीट' },
};

export class I18nEngine {
  constructor(lang = 'en') {
    this.lang = lang;
  }

  t(key) {
    return translationsData[this.lang]?.[key] || translationsData['en']?.[key] || key;
  }
}
