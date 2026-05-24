export const tips = [
  { type: "ok", text: "Plain background preferred" },
  { type: "ok", text: "Face clearly visible & centred" },
  { type: "ok", text: "Neutral expression, eyes open" },
  { type: "no", text: "Avoid sunglasses or hats" },
];

export const iconMap = {
  ok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="6" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  ),
  no: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="6" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="5" y="10" width="14" height="10" rx="3" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
    </svg>
  ),
};
