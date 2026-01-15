import { apiClient } from './axios';
import { API_PATHS } from '@/types';
import { logger } from '@/lib/logger';

/**
 * TTS API Service
 *
 * This service provides text-to-speech functionality using Google Cloud TTS API.
 * Endpoints:
 * - POST /api/tts/synthesize: Convert text to speech audio
 */
export class TTSApiService {
  /**
   * Synthesize text to speech
   * POST /api/tts/synthesize
   * Request: { text: string }
   * Response: { audioUrl: string }
   */
  static async synthesizeSpeech(text: string): Promise<{ audioUrl: string }> {
    try {
      logger.debug('Synthesizing speech', {
        textLength: text.length,
        endpoint: API_PATHS.TTS.SYNTHESIZE
      });

      const response = await apiClient.post<{ success: boolean; data: { audioUrl: string } }>(
        API_PATHS.TTS.SYNTHESIZE,
        { text }
      );

      if (!response.data.success) {
        throw new Error('TTS API returned unsuccessful response');
      }

      logger.info('Speech synthesized successfully', {
        textLength: text.length
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to synthesize speech', {
        error: error.message,
        textLength: text.length
      });
      throw error;
    }
  }
}
