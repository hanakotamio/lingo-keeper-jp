import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from '@/lib/logger.js';
import prisma from '@/lib/db.js';
import storyRoutes from '@/routes/story.routes.js';
import chapterRoutes from '@/routes/chapter.routes.js';
import quizRoutes from '@/routes/quiz.routes.js';
import ttsRoutes from '@/routes/tts.routes.js';
import progressRoutes from '@/routes/progress.routes.js';
import adminRoutes from '@/routes/admin.routes.js';
import healthRoutes from '@/routes/health.routes.js';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware.js';
import { metricsMiddleware, metricsHandler } from '@/middleware/metrics.middleware.js';
import {
  requestIdMiddleware,
  performanceMonitoringMiddleware,
  errorRateMonitoringMiddleware,
} from '@/middleware/monitoring.middleware.js';

// Load environment variables
dotenv.config();

const app = express();
// Cloud Run uses PORT env var, fallback to 8534 for local development
const PORT = process.env.PORT || 8534;

// Middleware
// Security headers (helmet.js)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration - allow Vercel frontend
const allowedOrigins = [
  'http://localhost:3847',
  'https://frontend-seven-beta-72.vercel.app', // Production alias
  /^https:\/\/frontend-[a-z0-9-]+-mio-furumakis-projects\.vercel\.app$/, // Preview deployments
  /^https:\/\/frontend-[a-z0-9-]+\.vercel\.app$/, // All Vercel deployments
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or matches pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      return allowed.test(origin);
    });

    if (isAllowed || process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monitoring middleware
app.use(requestIdMiddleware);
app.use(performanceMonitoringMiddleware);
app.use(errorRateMonitoringMiddleware);

// Request logging middleware
app.use((req, _res, next) => {
  const requestId = req.headers['x-request-id'] as string;
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

// Metrics collection middleware
app.use(metricsMiddleware);

// Root endpoint - API welcome message
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Lingo Keeper JP API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      stories: '/api/stories',
      chapters: '/api/chapters',
      quizzes: '/api/quizzes',
      tts: '/api/tts',
      progress: '/api/progress',
      metrics: '/api/metrics',
    },
  });
});

// Health and metrics endpoints
app.use('/api/health', healthRoutes);
app.get('/api/metrics', metricsHandler);

// API Routes
app.use('/api/stories', storyRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, starting graceful shutdown`);

  // Close server to stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Disconnect from database
      await prisma.$disconnect();
      logger.info('Database connection closed');

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  });

  // Force shutdown after 8 seconds (CLAUDE.md requirement)
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 8000);
};

// Listen for termination signals
process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  void gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;
