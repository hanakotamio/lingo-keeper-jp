import type { Request, Response } from 'express';
import prisma from '@/lib/db.js';
import logger from '@/lib/logger.js';
import os from 'os';

interface HealthCheckResult {
  success: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: {
      status: 'connected' | 'disconnected' | 'slow';
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: 'healthy' | 'warning' | 'critical';
      usedPercent: number;
      used: number;
      total: number;
    };
    cpu: {
      status: 'healthy' | 'warning' | 'critical';
      loadAverage: number[];
      cores: number;
    };
    externalApis?: {
      openai: 'available' | 'unavailable' | 'degraded';
      googleTTS: 'available' | 'unavailable' | 'degraded';
    };
  };
}

/**
 * Basic health check endpoint
 * Used by Cloud Run for liveness/readiness probes
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Simple database ping
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
};

/**
 * Detailed health check endpoint
 * Provides comprehensive system status including memory, CPU, and external services
 */
export const detailedHealthCheck = async (_req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: { status: 'connected' },
      memory: { status: 'healthy', usedPercent: 0, used: 0, total: 0 },
      cpu: { status: 'healthy', loadAverage: [], cores: 0 },
    },
  };

  // Database health check
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStart;

    result.checks.database.responseTime = dbResponseTime;

    if (dbResponseTime > 1000) {
      result.checks.database.status = 'slow';
      result.status = 'degraded';
    } else {
      result.checks.database.status = 'connected';
    }
  } catch (error) {
    result.checks.database.status = 'disconnected';
    result.checks.database.error = error instanceof Error ? error.message : String(error);
    result.status = 'unhealthy';
    result.success = false;
  }

  // Memory health check
  const memUsed = process.memoryUsage();
  const totalMem = os.totalmem();
  const usedMem = memUsed.heapUsed;
  const memPercent = (usedMem / totalMem) * 100;

  result.checks.memory = {
    status: memPercent > 90 ? 'critical' : memPercent > 75 ? 'warning' : 'healthy',
    usedPercent: Math.round(memPercent * 100) / 100,
    used: Math.round(usedMem / 1024 / 1024), // MB
    total: Math.round(totalMem / 1024 / 1024), // MB
  };

  if (result.checks.memory.status === 'critical') {
    result.status = 'unhealthy';
    result.success = false;
  } else if (result.checks.memory.status === 'warning' && result.status === 'healthy') {
    result.status = 'degraded';
  }

  // CPU health check
  const loadAvg = os.loadavg();
  const cpuCores = os.cpus().length;
  const normalizedLoad = loadAvg[0] / cpuCores;

  result.checks.cpu = {
    status: normalizedLoad > 0.9 ? 'critical' : normalizedLoad > 0.7 ? 'warning' : 'healthy',
    loadAverage: loadAvg.map(l => Math.round(l * 100) / 100),
    cores: cpuCores,
  };

  if (result.checks.cpu.status === 'critical') {
    result.status = 'unhealthy';
    result.success = false;
  } else if (result.checks.cpu.status === 'warning' && result.status === 'healthy') {
    result.status = 'degraded';
  }

  // External API checks (optional, can be enabled with query param ?checkExternal=true)
  if (_req.query.checkExternal === 'true') {
    result.checks.externalApis = {
      openai: process.env.OPENAI_API_KEY ? 'available' : 'unavailable',
      googleTTS: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'available' : 'unavailable',
    };
  }

  const responseTime = Date.now() - startTime;

  logger.info('Detailed health check completed', {
    status: result.status,
    responseTime,
    database: result.checks.database.status,
    memory: result.checks.memory.status,
    cpu: result.checks.cpu.status,
  });

  const statusCode = result.status === 'unhealthy' ? 503 : result.status === 'degraded' ? 200 : 200;
  res.status(statusCode).json(result);
};

/**
 * Readiness check endpoint
 * Used by Cloud Run to determine if the service is ready to receive traffic
 */
export const readinessCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check if required environment variables are set
    const requiredEnvVars = ['DATABASE_URL'];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      res.status(503).json({
        success: false,
        ready: false,
        reason: 'Missing required environment variables',
        missing: missingVars,
      });
      return;
    }

    res.status(200).json({
      success: true,
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Readiness check failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(503).json({
      success: false,
      ready: false,
      reason: 'Database connection failed',
    });
  }
};

/**
 * Liveness check endpoint
 * Used by Cloud Run to determine if the service should be restarted
 */
export const livenessCheck = (_req: Request, res: Response): void => {
  // Simple check - if the process is running, it's alive
  res.status(200).json({
    success: true,
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
