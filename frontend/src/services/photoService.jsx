import api from './api';

/**
 * Upload a photo file to the backend.
 * @param {File} file
 * @returns {Promise<{ id: string }>}
 */
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED'
        ? 'Upload timed out. Please try again.'
        : 'Upload failed. Please check your connection.');
    throw new Error(message);
  }
};

/**
 * Trigger AI processing for an uploaded photo.
 * @param {{ uploadId: string, background: string, size: string }}
 * @returns {Promise<{ id: string }>}
 */
export const processPhoto = async ({ uploadId, background, size }) => {
  try {
    const response = await api.post('/process', { uploadId, background, size });
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.response?.status === 503
        ? 'AI service is currently unavailable. Please try again later.'
        : 'Photo processing failed. Please try a different image.');
    throw new Error(message);
  }
};

/**
 * Generate an A4 print sheet.
 * @param {{ processedId: string, quantity: number }}
 * @returns {Promise<{ sheetUrl: string }>}
 */
export const generateSheet = async ({ processedId, quantity }) => {
  try {
    const response = await api.post('/print/generate-sheet', {
      processedId,
      quantity,
    });
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      'Failed to generate print sheet. Please try again.';
    throw new Error(message);
  }
};
