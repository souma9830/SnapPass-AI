import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import { cleanupOldUploads } from './src/utils/cleanupUploads.js';

const PORT = config.port;

connectDatabase();

// Run upload folders pruning task on startup, then every hour
cleanupOldUploads();
setInterval(cleanupOldUploads, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`✅  SnapPass AI backend running on http://localhost:${PORT}`);
  console.log(`🤖  AI Service URL: ${config.aiServiceUrl}`);
});
