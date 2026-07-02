export const validateFileHeaders = (buffer) => {
  const magic = buffer.toString('hex', 0, 4);
  return ['89504e47', 'ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'].includes(magic);
};