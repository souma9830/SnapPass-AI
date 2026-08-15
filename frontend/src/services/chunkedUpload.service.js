import axios from 'axios';

export async function uploadWithRetry(url, formData, onProgress, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        },
      });
      return response.data;
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}
