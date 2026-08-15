export const PASSPORT_PRESETS = {
    US: { widthMm: 51, heightMm: 51, name: "US Passport / Visa", bgColor: "#FFFFFF", maxHeadRatio: 0.69 },
    UK: { widthMm: 35, heightMm: 45, name: "UK Passport", bgColor: "#F0F0F0", maxHeadRatio: 0.75 },
    IN: { widthMm: 35, heightMm: 45, name: "India Passport", bgColor: "#FFFFFF", maxHeadRatio: 0.70 },
    EU: { widthMm: 35, heightMm: 45, name: "Schengen Visa", bgColor: "#E5E5E5", maxHeadRatio: 0.80 }
};

export const getPassportPreset = (code) => PASSPORT_PRESETS[code.toUpperCase()] || PASSPORT_PRESETS.US;