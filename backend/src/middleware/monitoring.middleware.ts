import type { Request, Response, NextFunction } from 'express';
import logger from '@/lib/logger.js';
import { recordDatabaseQuery } from '@/middleware/metrics.middleware.js';

/**
 * Request ID middleware
 * Adds a unique request ID to each request for tracing
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.headers['x-request-id'] as string ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
};

/**
 * Performance monitoring middleware
 * Tracks request duration and logs slow requests
 */
export const performanceMonitoringMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] as string;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;

    // Log slow requests (> 1s)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        requestId,
        method: req.method,
        route,
        duration,
        statusCode: res.statusCode,
      });
    }

    // Log very slow requests (> 5s) as errors
    if (duration > 5000) {
      logger.error('Very slow request detected', {
        requestId,
        method: req.method,
        route,
        duration,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Error rate tracking middleware
 * Monitors error rates and logs patterns
 */
let errorCount = 0;
let totalRequests = 0;
let lastErrorRateLog = Date.now();

export const errorRateMonitoringMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  totalRequests++;

  res.on('finish', () => {
    if (res.statusCode >= 500) {
      errorCount++;
    }

    // Log error rate every 100 requests or every 5 minutes
    const timeSinceLastLog = Date.now() - lastErrorRateLog;
    if (totalRequests % 100 === 0 || timeSinceLastLog > 300000) {
      const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;

      logger.info('Error rate summary', {
        errorRate: errorRate.toFixed(2) + '%',
        errorCount,
        totalRequests,
        timeWindow: `${Math.round(timeSinceLastLog / 1000)}s`,
      });

      // Alert if error rate is high
      if (errorRate > 5) {
        logger.error('High error rate detected', {
          errorRate: errorRate.toFixed(2) + '%',
          errorCount,
          totalRequests,
        });
      }

      // Reset counters
      errorCount = 0;
      totalRequests = 0;
      lastErrorRateLog = Date.now();
    }
  });

  next();
};

/**
 * Database query monitoring
 * Tracks database query performance
 */
export const createDatabaseMonitor = () => {
  return {
    async trackQuery<T>(operation: string, queryFn: () => Promise<T>): Promise<T> {
      const start = Date.now();

      try {
        const result = await queryFn();
        const duration = Date.now() - start;

        // Record metric
        recordDatabaseQuery(operation);

        // Log slow queries (> 200ms)
        if (duration > 200) {
          logger.warn('Slow database query', {
            operation,
            duration,
          });
        }

        // Log very slow queries (> 1s)
        if (duration > 1000) {
          logger.error('Very slow database query', {
            operation,
            duration,
          });
        }

        return result;
      } catch (error) {
        const duration = Date.now() - start;

        logger.error('Database query failed', {
          operation,
          duration,
          error: error instanceof Error ? error.message : String(error),
        });

        throw error;
      }
    },
  };
};

/**
 * External API monitoring
 * Tracks external API call performance and failures
 */
export const createExternalApiMonitor = () => {
  const apiCallCounts = new Map<string, { success: number; failure: number }>();

  return {
    async trackApiCall<T>(
      apiName: string,
      operation: string,
      apiFn: () => Promise<T>
    ): Promise<T> {
      const start = Date.now();
      const callKey = `${apiName}:${operation}`;

      try {
        const result = await apiFn();
        const duration = Date.now() - start;

        // Update success count
        const counts = apiCallCounts.get(callKey) || { success: 0, failure: 0 };
        counts.success++;
        apiCallCounts.set(callKey, counts);

        // Log slow API calls (> 2s)
        if (duration > 2000) {
          logger.warn('Slow external API call', {
            api: apiName,
            operation,
            duration,
          });
        }

        logger.info('External API call succeeded', {
          api: apiName,
          operation,
          duration,
        });

        return result;
      } catch (error) {
        const duration = Date.now() - start;

        // Update failure count
        const counts = apiCallCounts.get(callKey) || { success: 0, failure: 0 };
        counts.failure++;
        apiCallCounts.set(callKey, counts);

        // Calculate failure rate
        const failureRate = (counts.failure / (counts.success + counts.failure)) * 100;

        logger.error('External API call failed', {
          api: apiName,
          operation,
          duration,
          error: error instanceof Error ? error.message : String(error),
          failureRate: failureRate.toFixed(2) + '%',
          totalSuccess: counts.success,
          totalFailure: counts.failure,
        });

        throw error;
      }
    },

    getStats: () => {
      const stats: Record<string, { success: number; failure: number; failureRate: number }> = {};

      apiCallCounts.forEach((counts, key) => {
        const total = counts.success + counts.failure;
        const failureRate = total > 0 ? (counts.failure / total) * 100 : 0;

        stats[key] = {
          success: counts.success,
          failure: counts.failure,
          failureRate: parseFloat(failureRate.toFixed(2)),
        };
      });

      return stats;
    },
  };
};

// Export singleton instances
export const databaseMonitor = createDatabaseMonitor();
export const externalApiMonitor = createExternalApiMonitor();

export default {
  requestIdMiddleware,
  performanceMonitoringMiddleware,
  errorRateMonitoringMiddleware,
  databaseMonitor,
  externalApiMonitor,
};
