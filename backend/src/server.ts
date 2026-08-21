import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 AGROX Backend API Server running on http://127.0.0.1:${PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  console.log(`🏥 Health Check: http://127.0.0.1:${PORT}/api/v1/health`);
});
