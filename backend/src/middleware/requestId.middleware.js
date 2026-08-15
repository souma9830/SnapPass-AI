import { v4 as uuidv4 } from 'uuid';

export const requestId = (req, res, next) => {
  const correlationId = req.headers['x-request-id'] || req.headers['x-correlation-id'] || uuidv4();
  req.id = correlationId;
  req.correlationId = correlationId;
  res.setHeader('X-Request-ID', correlationId);
  res.setHeader('X-Correlation-ID', correlationId);
  next();
};
