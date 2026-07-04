/**
 * photoService.js — All API calls related to photo upload, processing, and printing.
 *
 * Each function is a thin wrapper around the Axios instance.
 * Pages and hooks should call these rather than `fetch` directly.
 */

import api from './api';

/**
 * Upload a photo file to the backend.
 * @param {File} file
 * @returns {Promise<{ fileId, filename, fileUrl }>}
 */
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

/**
 * Send a photo to the AI service for background removal + centering + resize.
 * Returns a Blob of the processed PNG.
 * @param {{ filename: string, backgroundColour: string, photoSizePreset: string }}
 * @returns {Promise<Blob>}
 */
export const processPhoto = async ({ filename, backgroundColour, photoSizePreset }) => {
  const { data } = await api.post(
    '/process',
    { filename, backgroundColour, photoSizePreset },
    { responseType: 'blob' }
  );
  return data;
};

/**
 * Request a printable A4 sheet from the backend.
 * Returns a Blob of the PNG sheet.
 * @param {{ filename: string, quantity: number, photoSizePreset: string }}
 * @returns {Promise<Blob>}
 */
export const generateSheet = async ({ filename, quantity, photoSizePreset }) => {
  const { data } = await api.post(
    '/print/generate-sheet',
    { filename, quantity, photoSizePreset },
    { responseType: 'blob' }
  );
  return data;
};

/**
 * Fetch the list of supported size presets from the backend.
 * @returns {Promise<Array>}
 */
export const getSizePresets = async () => {
  const { data } = await api.get('/print/presets');
  return data.data;
};
