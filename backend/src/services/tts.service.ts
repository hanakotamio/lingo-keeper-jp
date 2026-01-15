import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import type { google } from '@google-cloud/text-to-speech/build/protos/protos.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';

/**
 * TTS Service
 * Google Cloud Text-to-Speech APIを使用した音声合成
 * CLAUDE.md準拠: ja-JP-Neural2-B（標準音声）を使用
 */
export class TTSService {
  private client: TextToSpeechClient;

  constructor() {
    // Initialize Google Cloud TTS client
    // Credentials are loaded from GOOGLE_APPLICATION_CREDENTIALS env var
    this.client = new TextToSpeechClient();
    logger.info('Google Cloud TTS client initialized');
  }

  /**
   * Synthesize text to speech using Google Cloud TTS
   * @param text - Text to synthesize (Japanese text)
   * @returns Audio content as base64-encoded string
   */
  async synthesizeSpeech(text: string): Promise<string> {
    const tracker = new PerformanceTracker('TTSService.synthesizeSpeech');
    logger.info('Synthesizing speech', { textLength: text.length });

    try {
      // Validate input
      if (!text || text.trim() === '') {
        const error = new Error('Text is required for synthesis');
        logger.error('Invalid text for synthesis', { text });
        throw error;
      }

      // Check text length (Google Cloud TTS limit is 5000 characters)
      if (text.length > 5000) {
        const error = new Error(
          `Text too long for synthesis (${text.length} characters). Maximum is 5000 characters.`
        );
        logger.error('Text exceeds maximum length', {
          textLength: text.length,
          maxLength: 5000,
        });
        throw error;
      }

      // Prepare the request (CLAUDE.md specifications)
      const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: {
          languageCode: 'ja-JP',
          name: 'ja-JP-Neural2-B', // Neural2 voice for better quality (Female voice)
        },
        audioConfig: {
          audioEncoding: 'MP3', // MP3 format for web compatibility
          speakingRate: 1.0, // Normal speed
          pitch: 0.0, // Normal pitch
          volumeGainDb: 0.0, // Normal volume
        },
      };

      logger.debug('Request prepared', {
        languageCode: 'ja-JP',
        voiceName: 'ja-JP-Neural2-B',
      });

      // Call Google Cloud TTS API
      logger.info('Calling Google Cloud TTS API', {
        languageCode: 'ja-JP',
        voiceName: 'ja-JP-Neural2-B',
        textLength: text.length,
      });

      const [response] = await this.client.synthesizeSpeech(request);

      logger.debug('API call completed');

      // Validate response
      if (!response.audioContent) {
        const error = new Error('No audio content received from Google Cloud TTS');
        logger.error('Empty audio content from TTS API');
        throw error;
      }

      // Convert audio content to base64
      const audioBase64 = Buffer.from(response.audioContent as Uint8Array).toString('base64');
      const audioDataUrl = `data:audio/mp3;base64,${audioBase64}`;

      logger.info('Speech synthesis successful', {
        textLength: text.length,
        audioSizeBytes: response.audioContent.length,
        audioSizeKB: Math.round((response.audioContent.length / 1024) * 100) / 100,
      });

      tracker.end({
        textLength: text.length,
        audioSizeKB: Math.round((response.audioContent.length / 1024) * 100) / 100,
      });

      return audioDataUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to synthesize speech', {
        error: errorMessage,
        textLength: text.length,
      });

      // Check if it's a Google Cloud API error
      if (error && typeof error === 'object' && 'code' in error) {
        const apiError = error as { code: number; message: string };
        logger.error('Google Cloud TTS API error', {
          code: apiError.code,
          message: apiError.message,
        });

        // Provide more specific error messages
        if (apiError.code === 7) {
          throw new Error('Permission denied. Please check GOOGLE_APPLICATION_CREDENTIALS.');
        } else if (apiError.code === 3) {
          throw new Error('Invalid request to Google Cloud TTS API.');
        } else if (apiError.code === 8) {
          throw new Error('Google Cloud TTS API quota exceeded.');
        }
      }

      throw error;
    }
  }

  /**
   * Health check for Google Cloud TTS service
   * @returns true if service is available, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to synthesize a simple test phrase
      const testText = 'テスト';
      await this.synthesizeSpeech(testText);
      logger.info('TTS service health check passed');
      return true;
    } catch (error) {
      logger.error('TTS service health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

export const ttsService = new TTSService();
