import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const loggerMiddleware = (req, res, next) => {
  req.id = uuidv4();
  logger.info({
    message: 'Incoming Request',
    method: req.method,
    url: req.url,
    correlationId: req.id
  });
  next();
};