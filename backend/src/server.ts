import { app } from './app.js';
import { env } from './config/env.js';

const PORT = Number(process.env.PORT) || Number(env.PORT) || 4000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 AGROX Backend API Server running on port ${PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/api/v1/health`);
});
