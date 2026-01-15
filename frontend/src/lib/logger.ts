/**
 * Logger utility for structured logging
 *
 * Usage:
 * - logger.debug: Development-only logs (automatically disabled in production)
 * - logger.info: Important information logging
 * - logger.error: Error logging
 *
 * All logs are structured and can be easily integrated with monitoring tools.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // In production, only log warnings and errors
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return;
    }

    // Use appropriate console method
    switch (level) {
      case 'debug':
        console.debug('[DEBUG]', message, context || '');
        break;
      case 'info':
        console.info('[INFO]', message, context || '');
        break;
      case 'warn':
        console.warn('[WARN]', message, context || '');
        break;
      case 'error':
        console.error('[ERROR]', message, context || '');
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }
}

export const logger = new Logger();
