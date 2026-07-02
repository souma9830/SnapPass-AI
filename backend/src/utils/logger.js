/**
 * Simple custom logger wrapping console methods with formatted timestamps and levels.
 */
const logger = {
  info: (msg, ...args) => {
    console.log(`[${new Date().toISOString()}] [INFO]: ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`[${new Date().toISOString()}] [WARN]: ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`[${new Date().toISOString()}] [ERROR]: ${msg}`, ...args);
  },
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${new Date().toISOString()}] [DEBUG]: ${msg}`, ...args);
    }
  }
};

export default logger;
