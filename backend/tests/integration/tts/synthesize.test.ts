import request from 'supertest';
import app from '../../../src/index.js';
import prisma from '../../../src/lib/db.js';
import { MilestoneTracker } from '../../utils/MilestoneTracker.js';

/**
 * TTS API Integration Tests
 * 実データを使用した統合テスト（モック不使用）
 * Google Cloud Text-to-Speech APIとの実際の連携をテスト
 *
 * API Spec: docs/api-specs/story-experience-api.md (lines 95-115)
 */

describe('TTS API Integration Tests', () => {
  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/tts/synthesize', () => {
    it('should synthesize Japanese text to speech successfully', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      // Test text: Simple Japanese greeting
      const testText = 'こんにちは、世界';

      tracker.setOperation(`API呼び出し: POST /api/tts/synthesize (${testText.length}文字)`);
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: testText })
        .expect(200);

      tracker.mark('APIレスポンス受信');

      // Verify response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('audioUrl');
      expect(typeof response.body.data.audioUrl).toBe('string');

      tracker.mark('レスポンス構造検証完了');

      // Verify audio URL format (data:audio/mp3;base64,...)
      const audioUrl = response.body.data.audioUrl;
      expect(audioUrl).toMatch(/^data:audio\/mp3;base64,/);

      tracker.mark('音声URL形式検証完了');

      // Extract base64 audio data
      const base64Audio = audioUrl.replace(/^data:audio\/mp3;base64,/, '');
      const audioBuffer = Buffer.from(base64Audio, 'base64');

      // Verify audio data is not empty
      expect(audioBuffer.length).toBeGreaterThan(0);

      tracker.mark('音声データ検証完了');

      console.log('\n========== TTS Synthesis Result ==========');
      console.log(`Text: ${testText}`);
      console.log(`Audio size: ${Math.round((audioBuffer.length / 1024) * 100) / 100} KB`);
      console.log(`Audio URL length: ${audioUrl.length} characters`);
      console.log('==========================================\n');

      tracker.summary();
    });

    it('should synthesize longer Japanese text successfully', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      // Test text: Longer Japanese sentence
      const testText = '東京は日本の首都です。人口が多く、たくさんの人が働いています。';

      tracker.setOperation(`API呼び出し: POST /api/tts/synthesize (${testText.length}文字)`);
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: testText })
        .expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('audioUrl');

      const audioUrl = response.body.data.audioUrl;
      expect(audioUrl).toMatch(/^data:audio\/mp3;base64,/);

      const base64Audio = audioUrl.replace(/^data:audio\/mp3;base64,/, '');
      const audioBuffer = Buffer.from(base64Audio, 'base64');
      expect(audioBuffer.length).toBeGreaterThan(0);

      tracker.mark('音声合成検証完了');

      console.log('\n========== Long Text TTS Result ==========');
      console.log(`Text length: ${testText.length} characters`);
      console.log(`Audio size: ${Math.round((audioBuffer.length / 1024) * 100) / 100} KB`);
      console.log('==========================================\n');

      tracker.summary();
    });

    it('should synthesize story chapter text successfully', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      // Test text: Story chapter content
      const testText = `田中さんは東京駅に着きました。
たくさんの人がいます。
「すみません、トイレはどこですか？」`;

      tracker.setOperation(`API呼び出し: ストーリーテキスト合成 (${testText.length}文字)`);
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: testText })
        .expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.data.audioUrl).toMatch(/^data:audio\/mp3;base64,/);

      tracker.mark('ストーリー音声合成検証完了');

      console.log('\n========== Story Chapter TTS Result ==========');
      console.log(`Chapter text length: ${testText.length} characters`);
      console.log('==============================================\n');

      tracker.summary();
    });

    it('should return 400 for missing text', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Missing text');
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({})
        .expect(400);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('required');

      tracker.mark('エラーハンドリング検証完了');
      tracker.summary();
    });

    it('should return 400 for empty text', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Empty text');
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: '' })
        .expect(400);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('required');

      tracker.mark('エラーハンドリング検証完了');
      tracker.summary();
    });

    it('should return 400 for invalid text type', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Invalid text type');
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: 12345 })
        .expect(400);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('string');

      tracker.mark('エラーハンドリング検証完了');
      tracker.summary();
    });

    it('should return 400 for text exceeding maximum length', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      // Create text longer than 5000 characters (Google Cloud TTS limit)
      const longText = 'あ'.repeat(5001);

      tracker.setOperation(`API呼び出し: Text too long (${longText.length}文字)`);
      const response = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: longText })
        .expect(400);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('too long');

      tracker.mark('エラーハンドリング検証完了');
      tracker.summary();
    });
  });

  describe('GET /api/tts/health', () => {
    it('should return healthy status', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/tts/health');
      const response = await request(app).get('/api/tts/health').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('Google Cloud Text-to-Speech');
      expect(response.body).toHaveProperty('timestamp');

      tracker.mark('ヘルスチェック検証完了');

      console.log('\n========== TTS Health Check Result ==========');
      console.log(`Status: ${response.body.status}`);
      console.log(`Service: ${response.body.service}`);
      console.log('=============================================\n');

      tracker.summary();
    });
  });

  describe('Complete TTS Flow', () => {
    it('should successfully synthesize multiple texts in sequence', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('フローテスト開始');

      // Test 1: Short text
      tracker.setOperation('ステップ1: 短いテキスト合成');
      const response1 = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: 'こんにちは' })
        .expect(200);

      tracker.mark('短いテキスト合成完了');
      expect(response1.body.success).toBe(true);

      // Test 2: Medium text
      tracker.setOperation('ステップ2: 中程度のテキスト合成');
      const response2 = await request(app)
        .post('/api/tts/synthesize')
        .send({ text: '今日は良い天気ですね。散歩に行きましょう。' })
        .expect(200);

      tracker.mark('中程度のテキスト合成完了');
      expect(response2.body.success).toBe(true);

      // Test 3: Long text
      tracker.setOperation('ステップ3: 長いテキスト合成');
      const response3 = await request(app)
        .post('/api/tts/synthesize')
        .send({
          text: '東京は日本の首都です。たくさんの人が住んでいて、毎日賑やかです。電車やバスで通勤している人が多いです。',
        })
        .expect(200);

      tracker.mark('長いテキスト合成完了');
      expect(response3.body.success).toBe(true);

      tracker.mark('フローテスト完了');

      console.log('\n========== Complete TTS Flow Success ==========');
      console.log('Test 1: Short text - SUCCESS');
      console.log('Test 2: Medium text - SUCCESS');
      console.log('Test 3: Long text - SUCCESS');
      console.log('================================================\n');

      tracker.summary();
    });
  });
});
