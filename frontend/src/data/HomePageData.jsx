import { Upload, Sparkles, Settings2, Download } from 'lucide-react';

export const features = [
  {
    icon: 'bg-remove',
    title: 'AI Background Removal',
    desc: 'Remove any background instantly with rembg — no manual selection needed.',
    image: '/f-1.png',
    tag: 'AI Powered',
  },
  {
    icon: 'face-center',
    title: 'Auto Face Centering',
    desc: 'OpenCV detects and centers your face to meet passport photo guidelines.',
    image: '/f-2.png',
    tag: 'OpenCV',
  },
  {
    icon: 'sizes',
    title: 'Standard Size Presets',
    desc: 'India, USA, UK, Schengen and more — pick a preset and we handle the DPI.',
    image: '/f-3.png',
    tag: 'Multiple Formats',
  },
  {
    icon: 'compare',
    title: 'Passport Requirement Comparator',
    desc: 'Compare passport and visa photo requirements across multiple countries before generating your photo.',
    image: '/f-3.png',
    tag: 'Compare Standards',
    link: '/compare-requirements',
  },
  {
    icon: 'print',
    title: 'A4 Print Layout',
    desc: 'Generate a printable A4 sheet with multiple photos — save on printing costs.',
    image: '/f-4.png',
    tag: 'Print Ready',
  },
];

export const stats = [
  { value: '10K+', label: 'Photos Processed' },
  { value: '50+', label: 'Countries Supported' },
  { value: '99.9%', label: 'Face Detection Rate' },
  { value: '4.7/5', label: 'User Rating' },
];

export const steps = [
  {
    label: 'Upload your photo',
    icon: <Upload size={22} />,
    subtitle: 'Choose a photo from your device',
  },
  {
    label: 'AI processes & centers',
    icon: <Sparkles size={22} />,
    subtitle: 'Advanced AI optimization for your photo',
  },
  {
    label: 'Choose size & quantity',
    icon: <Settings2 size={22} />,
    subtitle: 'Select your required photo format and copies',
  },
  {
    label: 'Download & print',
    icon: <Download size={22} />,
    subtitle: 'Get a high-quality print-ready photo instantly',
  },
];

export const chips = [
  { icon: 'spark', label: 'Background Removed' },
  { icon: 'target', label: 'Auto Centered' },
  { icon: 'printer', label: 'Print Ready' },
];

export const iconMap = {
  spark: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3l1.9 5.7L19 11l-5.1 2.3L12 19l-1.9-5.7L5 11l5.1-2.3L12 3z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  ),
  printer: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 8V4h10v4" />
      <rect x="5" y="9" width="14" height="8" rx="2" />
      <path d="M7 17v3h10v-3" />
      <path d="M8.5 13.5h7" />
    </svg>
  ),
  'bg-remove': (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 14l3-3 3 3 4-5" />
      <path d="M8 8h3" />
    </svg>
  ),
  'face-center': (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="10" r="2" />
      <path d="M8.5 16c1-2 6-2 7 0" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  sizes: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="8" height="12" rx="2" />
      <rect x="12" y="7" width="8" height="12" rx="2" />
      <path d="M7 9h2M7 12h2M15 11h2M15 14h2" />
    </svg>
  ),
  print: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 9V4h12v5" />
      <rect x="4" y="10" width="16" height="7" rx="2" />
      <path d="M7 17v3h10v-3" />
      <path d="M9 13h6" />
    </svg>
  ),
  compare: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6h7v5H4z" />
      <path d="M13 6h7v5h-7z" />
      <path d="M4 13h7v5H4z" />
      <path d="M13 13h7v5h-7z" />
    </svg>
  ),
};
