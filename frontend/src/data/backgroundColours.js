/**
 * backgroundColours.js — Single source of truth for passport photo background
 * colour presets used across the frontend (BackgroundSelector) and passed to
 * the backend /api/process endpoint.
 *
 * Each entry contains:
 *   id      — the identifier sent to the backend and stored in session
 *   label   — human-readable display name
 *   hex     — CSS colour for the UI swatch preview
 *   country — optional hint shown in the tooltip (most common use case)
 *
 * Backend acceptance list (bg_remove.py SUPPORTED_COLOURS) must stay in sync.
 * When adding a new colour here, also add it to python-ai-service bg_remove.py.
 */

export const BACKGROUND_COLOURS = [
  {
    id: 'white',
    label: 'White',
    hex: '#ffffff',
    country: 'Universal / India / UK',
  },
  {
    id: 'off-white',
    label: 'Off-White',
    hex: '#f5f0e8',
    country: 'Australia / New Zealand',
  },
  {
    id: 'blue',
    label: 'Blue',
    hex: '#4372c4',
    country: 'USA Visa / China',
  },
  {
    id: 'light-blue',
    label: 'Light Blue',
    hex: '#cfe2ff',
    country: 'Canada / Schengen',
  },
  {
    id: 'grey',
    label: 'Grey',
    hex: '#c8c8c8',
    country: 'Various',
  },
  {
    id: 'red',
    label: 'Red',
    hex: '#e53935',
    country: 'Malaysia NRIC',
  },
  {
    id: 'custom',
    label: 'Custom',
    hex: null, // user-supplied hex from colour picker
    country: null,
  },
];

/**
 * Returns the first matching background entry by id, or null.
 * @param {string} id
 */
export const findBackground = (id) =>
  BACKGROUND_COLOURS.find((bg) => bg.id === id) ?? null;

/**
 * Ids accepted by the backend Python service.
 * Kept separate so we can gate the colour picker "custom" option
 * without breaking the standard preset list.
 */
export const BACKEND_ACCEPTED_IDS = BACKGROUND_COLOURS.filter(
  (bg) => bg.id !== 'custom'
).map((bg) => bg.id);
