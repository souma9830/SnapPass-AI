import logger from '../utils/logger.js';
import { config } from '../config/config.js';

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message,
    stack: err.stack,
    correlationId: req.id,
    path: req.path
  });

  res.status(statusCode).json({
    success: false,
    message,
    correlationId: req.id
  });
};

export default errorMiddleware;