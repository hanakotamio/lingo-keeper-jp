import type { Request, Response } from 'express';
import { ttsService } from '@/services/tts.service.js';
import logger from '@/lib/logger.js';

/**
 * TTS Controller
 * リクエスト処理とレスポンス形成を担当
 * API Spec: docs/api-specs/story-experience-api.md (lines 95-115)
 */
export class TTSController {
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
  async synthesizeSpeech(req: Request, res: Response): Promise<void> {
    logger.info('POST /api/tts/synthesize', {
      hasText: !!req.body.text,
      textLength: req.body.text?.length,
    });

    try {
      // Validate request body
      const { text } = req.body;

      if (!text) {
        logger.error('Missing text in request body');
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Text is required in request body',
        });
        return;
      }

      if (typeof text !== 'string') {
        logger.error('Invalid text type', { textType: typeof text });
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Text must be a string',
        });
        return;
      }

      if (text.trim() === '') {
        logger.error('Empty text in request body');
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Text is required in request body',
        });
        return;
      }

      // Synthesize speech
      const audioUrl = await ttsService.synthesizeSpeech(text);

      res.status(200).json({
        success: true,
        data: {
          audioUrl,
        },
      });

      logger.info('Speech synthesis successful', {
        textLength: text.length,
        audioUrlLength: audioUrl.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to synthesize speech', {
        error: errorMessage,
        textLength: req.body.text?.length,
      });

      // Check if it's a validation error (text too long, etc.)
      if (errorMessage.includes('too long') || errorMessage.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      // Check if it's a service unavailable error (API quota, etc.)
      if (
        errorMessage.includes('quota') ||
        errorMessage.includes('Permission denied') ||
        errorMessage.includes('GOOGLE_APPLICATION_CREDENTIALS')
      ) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          message:
            process.env.NODE_ENV === 'production'
              ? 'Text-to-Speech service is temporarily unavailable'
              : errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message:
          process.env.NODE_ENV === 'production'
            ? 'Failed to synthesize speech'
            : errorMessage,
      });
    }
  }

  /**
   * GET /api/tts/health
   * Check TTS service health
   */
  async healthCheck(_req: Request, res: Response): Promise<void> {
    logger.info('GET /api/tts/health');

    try {
      const isHealthy = await ttsService.healthCheck();

      if (isHealthy) {
        res.status(200).json({
          success: true,
          status: 'healthy',
          service: 'Google Cloud Text-to-Speech',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(503).json({
          success: false,
          status: 'unhealthy',
          service: 'Google Cloud Text-to-Speech',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error('TTS health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      res.status(503).json({
        success: false,
        status: 'unhealthy',
        service: 'Google Cloud Text-to-Speech',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const ttsController = new TTSController();
