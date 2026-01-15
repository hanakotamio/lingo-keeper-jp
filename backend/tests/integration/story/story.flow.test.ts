import request from 'supertest';
import app from '../../../src/index.js';
import prisma from '../../../src/lib/db.js';
import { MilestoneTracker } from '../../utils/MilestoneTracker.js';

/**
 * Story API Integration Tests
 * 実データを使用した統合テスト（モック不使用）
 */

describe('Story API Integration Tests', () => {
  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe('GET /api/stories', () => {
    it('should return all stories successfully', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/stories');
      const response = await request(app)
        .get('/api/stories')
        .expect(200);

      tracker.mark('APIレスポンス受信');

      // Verify response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);

      tracker.mark('レスポンス構造検証完了');

      // Verify story data structure
      const story = response.body.data[0];
      expect(story).toHaveProperty('story_id');
      expect(story).toHaveProperty('title');
      expect(story).toHaveProperty('description');
      expect(story).toHaveProperty('level_jlpt');
      expect(story).toHaveProperty('level_cefr');
      expect(story).toHaveProperty('estimated_time');
      expect(story).toHaveProperty('root_chapter_id');
      expect(story).toHaveProperty('created_at');
      expect(story).toHaveProperty('updated_at');

      tracker.mark('ストーリーデータ構造検証完了');

      console.log(`Total stories returned: ${response.body.count}`);
      tracker.summary();
    });

    it('should filter stories by level (N3-B1)', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/stories?levelFilter=N3-B1');
      const response = await request(app)
        .get('/api/stories')
        .query({ levelFilter: 'N3-B1' })
        .expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Verify all stories match the filter
      response.body.data.forEach((story: { level_jlpt: string; level_cefr: string }) => {
        expect(story.level_jlpt).toBe('N3');
        expect(story.level_cefr).toBe('B1');
      });

      tracker.mark('フィルター検証完了');

      console.log(`Filtered stories (N3-B1): ${response.body.count}`);
      tracker.summary();
    });

    it('should return 400 for invalid level filter', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Invalid levelFilter');
      const response = await request(app)
        .get('/api/stories')
        .query({ levelFilter: 'INVALID' })
        .expect(400);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Invalid level filter');

      tracker.mark('エラーハンドリング検証完了');
      tracker.summary();
    });
  });

  describe('GET /api/stories/:id', () => {
    it('should return a specific story successfully', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/stories/1');
      const response = await request(app)
        .get('/api/stories/1')
        .expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('story_id', '1');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data.title).toBe('東京での新しい生活');

      tracker.mark('ストーリー検証完了');

      console.log(`Story retrieved: ${response.body.data.title}`);
      tracker.summary();
    });

    it('should return 404 for non-existent story', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Non-existent story');
      const response = await request(app)
        .get('/api/stories/999999')
        .expect(404);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toContain('not found');

      tracker.mark('404エラー検証完了');
      tracker.summary();
    });
  });

  describe('GET /api/chapters/:id', () => {
    it('should return a specific chapter with choices', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/chapters/ch-1-1');
      const response = await request(app)
        .get('/api/chapters/ch-1-1')
        .expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('chapter_id', 'ch-1-1');
      expect(response.body.data).toHaveProperty('story_id', '1');
      expect(response.body.data).toHaveProperty('content');
      expect(response.body.data).toHaveProperty('choices');
      expect(Array.isArray(response.body.data.choices)).toBe(true);
      expect(response.body.data.choices.length).toBeGreaterThan(0);

      tracker.mark('チャプター検証完了');

      // Verify choice structure
      const choice = response.body.data.choices[0];
      expect(choice).toHaveProperty('choice_id');
      expect(choice).toHaveProperty('choice_text');
      expect(choice).toHaveProperty('next_chapter_id');
      expect(choice).toHaveProperty('display_order');

      tracker.mark('選択肢検証完了');

      console.log(`Chapter retrieved with ${response.body.data.choices.length} choices`);
      tracker.summary();
    });

    it('should return 404 for non-existent chapter', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Non-existent chapter');
      const response = await request(app)
        .get('/api/chapters/non-existent')
        .expect(404);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');

      tracker.mark('404エラー検証完了');
      tracker.summary();
    });
  });

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/health');
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('healthy');
      expect(response.body.database).toBe('connected');
      expect(response.body).toHaveProperty('timestamp');

      tracker.mark('ヘルスチェック検証完了');
      tracker.summary();
    });
  });

  describe('Complete Story Flow', () => {
    it('should successfully navigate through story list -> story detail -> chapter', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('フローテスト開始');

      // Step 1: Get story list
      tracker.setOperation('ステップ1: ストーリー一覧取得');
      const storiesResponse = await request(app)
        .get('/api/stories')
        .expect(200);

      tracker.mark('ストーリー一覧取得完了');

      expect(storiesResponse.body.data.length).toBeGreaterThan(0);
      const firstStory = storiesResponse.body.data[0];
      console.log(`Selected story: ${firstStory.title}`);

      // Step 2: Get story detail
      tracker.setOperation('ステップ2: ストーリー詳細取得');
      const storyResponse = await request(app)
        .get(`/api/stories/${firstStory.story_id}`)
        .expect(200);

      tracker.mark('ストーリー詳細取得完了');

      expect(storyResponse.body.data.story_id).toBe(firstStory.story_id);
      const rootChapterId = storyResponse.body.data.root_chapter_id;
      console.log(`Root chapter ID: ${rootChapterId}`);

      // Step 3: Get root chapter
      tracker.setOperation('ステップ3: ルートチャプター取得');
      const chapterResponse = await request(app)
        .get(`/api/chapters/${rootChapterId}`)
        .expect(200);

      tracker.mark('ルートチャプター取得完了');

      expect(chapterResponse.body.data.chapter_id).toBe(rootChapterId);
      expect(chapterResponse.body.data).toHaveProperty('content');
      expect(chapterResponse.body.data).toHaveProperty('choices');

      tracker.mark('フローテスト完了');

      console.log('\n========== Complete Story Flow Success ==========');
      console.log(`Story: ${firstStory.title}`);
      console.log(`Root Chapter: ${rootChapterId}`);
      console.log(`Choices available: ${chapterResponse.body.data.choices.length}`);
      console.log('=================================================\n');

      tracker.summary();
    });
  });
});
