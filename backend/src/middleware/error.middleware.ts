import type { Request, Response, NextFunction } from 'express';
import logger from '@/lib/logger.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
  });

  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
};
