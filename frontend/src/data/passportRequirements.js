/**
 * Centralized passport and visa requirement definitions.
 *
 * This dataset is shared between:
 * - Size selector presets
 * - Requirement comparison tools
 * - Future country-specific guidance features
 */

export const PASSPORT_REQUIREMENTS = [
  {
    id: '35x45',
    label: 'Passport Size Photo — India / UK',
    width: 35,
    height: 45,
    dpi: 300,
    background: 'White or light plain background',
    headRatio: '70-80%',
    eyePosition: 'Centered',
  },

  {
    id: '51x51',
    label: 'Passport Size Photo — USA Visa',
    width: 51,
    height: 51,
    dpi: 300,
    background: 'Plain white background',
    headRatio: '50-70%',
    eyePosition: 'Centered',
  },

  {
    id: '33x48',
    label: 'Passport Size Photo — Schengen Visa',
    width: 33,
    height: 48,
    dpi: 300,
    background: 'Light background',
    headRatio: '70-80%',
    eyePosition: 'Centered',
  },

  {
    id: '40x60',
    label: 'Passport Size Photo — China Visa',
    width: 40,
    height: 60,
    dpi: 300,
    background: 'White background',
    headRatio: '70-80%',
    eyePosition: 'Centered',
  },

  {
    id: '2x2in',
    label: 'Passport Size Photo — US Passport',
    width: 50.8,
    height: 50.8,
    dpi: 300,
    background: 'Plain white background',
    headRatio: '50-69%',
    eyePosition: '28-35 mm from bottom',
  },

  {
    id: '50x70',
    label: 'Passport Size Photo — Canada Passport',
    width: 50,
    height: 70,
    dpi: 300,
    background: 'White background',
    headRatio: '70-80%',
    eyePosition: 'Centered',
  },

  {
    id: '45x45',
    label: 'Passport Size Photo — Japan Passport / Visa',
    width: 45,
    height: 45,
    dpi: 300,
    background: 'Plain background',
    headRatio: '70-80%',
    eyePosition: 'Centered',
  },

  {
    id: '35x50',
    label: 'Passport Size Photo — Malaysia Passport',
    width: 35,
    height: 50,
    dpi: 300,
    background: 'White background',
    headRatio: '70-80%',
    eyePosition: 'Centered',
  },
];
