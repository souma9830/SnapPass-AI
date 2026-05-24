import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';

const PORT = config.port;


connectDatabase();

app.listen(PORT, () => {
  console.log(`✅  SnapPass AI backend running on http://localhost:${PORT}`);
  console.log(`🤖  AI Service URL: ${config.aiServiceUrl}`);
});
