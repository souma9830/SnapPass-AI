export const SIZE_PRESETS = [
  {
    id: '35x45',
    label: 'India / UK Passport',
    dimensions: '35 × 45 mm',
    country: 'India, UK',
  },
  {
    id: '51x51',
    label: 'USA Visa',
    dimensions: '51 × 51 mm',
    country: 'United States',
  },
  {
    id: '33x48',
    label: 'Schengen Visa',
    dimensions: '33 × 48 mm',
    country: 'EU/Schengen',
  },
  {
    id: '40x60',
    label: 'China Visa',
    dimensions: '40 × 60 mm',
    country: 'China',
  },
  {
    id: '2x2in',
    label: 'US Passport',
    dimensions: '2 × 2 in',
    country: 'United States',
  },
];

export const iconMap = {
  refresh: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 12a8 8 0 0 1-13.7 5.7" />
      <path d="M4 12a8 8 0 0 1 13.7-5.7" />
      <path d="M4 4v5h5" />
      <path d="M20 20v-5h-5" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3l1.9 5.7L19 11l-5.1 2.3L12 19l-1.9-5.7L5 11l5.1-2.3L12 3z" />
    </svg>
  ),
};

export const backgroundHexMap = {
  white: '#ffffff',
  'off-white': '#f5f0e8',
  'light-grey': '#d1d5db',
  'light-blue': '#bfdbfe',
  'light-red': '#fecaca',
};
