import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

// Prisma Client instance with logging configuration
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query', (e) => {
    logger.debug('Database Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

// Log database errors
prisma.$on('error', (e) => {
  logger.error('Database Error', {
    target: e.target,
    message: e.message,
  });
});

// Log database warnings
prisma.$on('warn', (e) => {
  logger.warn('Database Warning', {
    target: e.target,
    message: e.message,
  });
});

// Graceful shutdown handler
const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
};

process.on('SIGTERM', () => {
  void disconnectDB();
});

process.on('SIGINT', () => {
  void disconnectDB();
});

export default prisma;
