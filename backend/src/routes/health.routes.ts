import { Router } from 'express';
import {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
} from '@/controllers/health.controller.js';

const router = Router();

// Basic health check (used by Cloud Run)
router.get('/', healthCheck);

// Detailed health check with system metrics
router.get('/detailed', detailedHealthCheck);

// Kubernetes-style probes
router.get('/ready', readinessCheck);
router.get('/live', livenessCheck);

export default router;
