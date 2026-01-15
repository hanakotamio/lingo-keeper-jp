import { Router } from 'express';
import { ttsController } from '@/controllers/tts.controller.js';

const router = Router();

/**
 * TTS Routes
 * Text-to-Speech API endpoints
 * API Spec: docs/api-specs/story-experience-api.md (lines 95-115)
 */

/**
 * POST /api/tts/synthesize
 * Synthesize text to speech using Google Cloud TTS
 *
 * Request body:
 * {
 *   text: string // Japanese text to synthesize
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     audioUrl: string // Data URL with base64-encoded MP3 audio
 *   }
 * }
 */
router.post('/synthesize', (req, res) => void ttsController.synthesizeSpeech(req, res));

/**
 * GET /api/tts/health
 * Check TTS service health
 *
 * Response:
 * {
 *   success: true,
 *   status: 'healthy',
 *   service: 'Google Cloud Text-to-Speech',
 *   timestamp: string
 * }
 */
router.get('/health', (req, res) => void ttsController.healthCheck(req, res));

export default router;
