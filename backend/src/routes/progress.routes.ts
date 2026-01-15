import { Router } from 'express';
import { progressController } from '@/controllers/progress.controller.js';

const router = Router();

/**
 * @route GET /api/progress
 * @description 学習進捗データを取得
 * @access Public (MVP phase - no authentication)
 */
router.get('/', (req, res) => progressController.getProgress(req, res));

/**
 * @route GET /api/progress/graph
 * @description 進捗グラフデータを取得
 * @query period - 'week' | 'month' | 'year' (default: 'week')
 * @access Public (MVP phase - no authentication)
 */
router.get('/graph', (req, res) => progressController.getProgressGraph(req, res));

export default router;
