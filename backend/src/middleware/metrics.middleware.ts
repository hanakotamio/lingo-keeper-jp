import type { Request, Response, NextFunction } from 'express';
import client from 'prom-client';
import logger from '@/lib/logger.js';

// プロメテウスのデフォルトメトリクスを有効化
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// カスタムメトリクス定義

// HTTPリクエスト総数
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// HTTPリクエスト処理時間
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// データベースクエリ数
const databaseQueriesTotal = new client.Counter({
  name: 'database_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation'],
});

// アクティブ接続数
const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

/**
 * メトリクス収集ミドルウェア
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // アクティブ接続数をインクリメント
  activeConnections.inc();

  // レスポンス終了時の処理
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // 秒単位
    const route = req.route?.path || req.path;
    const statusCode = res.statusCode.toString();

    // メトリクス記録
    httpRequestsTotal.labels(req.method, route, statusCode).inc();
    httpRequestDuration.labels(req.method, route, statusCode).observe(duration);

    // アクティブ接続数をデクリメント
    activeConnections.dec();

    logger.debug('Metrics recorded', {
      method: req.method,
      route,
      statusCode,
      duration: `${duration.toFixed(3)}s`,
    });
  });

  next();
};

/**
 * メトリクスエンドポイントハンドラー
 */
export const metricsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);

    logger.debug('Metrics endpoint accessed', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (error) {
    logger.error('Failed to generate metrics', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).send('Failed to generate metrics');
  }
};

/**
 * データベースクエリメトリクスを記録
 */
export const recordDatabaseQuery = (operation: string): void => {
  databaseQueriesTotal.labels(operation).inc();
};

/**
 * メトリクスレジストリをリセット（テスト用）
 */
export const resetMetrics = (): void => {
  client.register.clear();
};

export default {
  metricsMiddleware,
  metricsHandler,
  recordDatabaseQuery,
  resetMetrics,
};
