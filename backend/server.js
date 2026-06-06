import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import logger from './src/utils/logger.js';

const PORT = config.port;

connectDatabase();

app.listen(PORT, () => {
  logger.info(`SnapPass AI backend running on http://localhost:${PORT}`);
  logger.info(`AI Service URL: ${config.aiServiceUrl}`);
});
