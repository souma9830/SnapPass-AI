import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import { verifyEnvironment } from './src/utils/envCheck.js';
import { CleanupTask } from './src/services/cleanupTask.js';

verifyEnvironment();
CleanupTask.startScheduler();
const PREFERRED_PORT = config.port;

connectDatabase();

function startServer(port, maxAttempts = 10) {
  let attempts = 0;
  
  const listen = (currentPort) => {
    const server = app.listen(currentPort, () => {
      console.log(`SnapPass AI backend running on http://localhost:${currentPort}`);
      console.log(`Health check: http://localhost:${currentPort}/health`);
      console.log(`API base: http://localhost:${currentPort}/api`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
        attempts++;
        console.warn(`[PortSync] Port ${currentPort} is in use. Retrying on port ${currentPort + 1}...`);
        listen(currentPort + 1);
      } else {
        console.error('[PortSync] Failed to start server:', err);
        process.exit(1);
      }
    });
  };

  listen(port);
}

startServer(PREFERRED_PORT);
