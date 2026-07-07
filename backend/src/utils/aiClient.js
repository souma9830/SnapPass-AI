import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const forwardImageToAIService = async (filePath, options = {}) => {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));
  Object.keys(options).forEach((key) => {
    form.append(key, options[key]);
  });

  const response = await axios.post(
    process.env.AI_SERVICE_URL || 'http://localhost:5000/process',
    form,
    { headers: form.getHeaders() }
  );
  return response.data;
};
