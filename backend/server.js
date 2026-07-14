import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import { verifyEnvironment } from './src/utils/envCheck.js';
import { CleanupTask } from './src/services/cleanupTask.js';

verifyEnvironment();
CleanupTask.startScheduler();
const PORT = config.port;

connectDatabase();

app.listen(PORT, () => {
  console.log(`SnapPass AI backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api`);
});
