import app from './src/app.js';
import config from './src/config/app.config.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`✅  SnapPass AI backend running on http://localhost:${PORT}`);
  console.log(`🤖  AI Service URL: ${config.aiServiceUrl}`);
});
