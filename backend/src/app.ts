import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { env } from './config/env.js';

export const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: env.CORS_ORIGIN !== '*',
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Global rate limiter (lenient)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.', code: 'RATE_LIMITED' },
  })
);

// Root greeting endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AGROX Backend API is running',
    version: '1.0.0',
    environment: env.NODE_ENV,
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      admin: '/api/v1/admin',
    },
  });
});

// Top-level Health Checks
app.get(['/health', '/api/health', '/api/v1/health'], (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'AGROX API is healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// All V1 API routes
app.use('/api/v1', routes);

// 404 for unmatched routes (must be after all defined routes)
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 'NOT_FOUND' });
});

// Centralized error handling (must be last)
app.use(errorHandler);
