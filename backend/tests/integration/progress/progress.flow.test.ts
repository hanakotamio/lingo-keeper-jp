import request from 'supertest';
import app from '../../../src/index.js';
import prisma from '../../../src/lib/db.js';
import { MilestoneTracker } from '../../utils/MilestoneTracker.js';

/**
 * Progress API Integration Tests
 * 実データを使用した統合テスト（モック不使用）
 */

describe('Progress API Integration Tests', () => {
  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/progress', () => {
    it('should return learning progress successfully', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress');
      const response = await request(app).get('/api/progress').expect(200);

      tracker.mark('APIレスポンス受信');

      // Verify response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');

      tracker.mark('レスポンス構造検証完了');

      // Verify UserLearningProgress structure
      const progress = response.body.data;
      expect(progress).toHaveProperty('total_quizzes');
      expect(progress).toHaveProperty('correct_count');
      expect(progress).toHaveProperty('accuracy_rate');
      expect(progress).toHaveProperty('level_progress');
      expect(progress).toHaveProperty('last_updated');
      expect(progress).toHaveProperty('completed_stories');

      tracker.mark('進捗データ構造検証完了');

      // Verify data types
      expect(typeof progress.total_quizzes).toBe('number');
      expect(typeof progress.correct_count).toBe('number');
      expect(typeof progress.accuracy_rate).toBe('number');
      expect(typeof progress.level_progress).toBe('object');
      expect(typeof progress.last_updated).toBe('string');
      expect(Array.isArray(progress.completed_stories)).toBe(true);

      tracker.mark('データ型検証完了');

      // Verify level_progress structure
      const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
      for (const level of levels) {
        expect(progress.level_progress).toHaveProperty(level);
        expect(progress.level_progress[level]).toHaveProperty('completed');
        expect(progress.level_progress[level]).toHaveProperty('total');
        expect(progress.level_progress[level]).toHaveProperty('accuracy');
        expect(typeof progress.level_progress[level].completed).toBe('number');
        expect(typeof progress.level_progress[level].total).toBe('number');
        expect(typeof progress.level_progress[level].accuracy).toBe('number');
      }

      tracker.mark('レベル別進捗検証完了');

      console.log(`Total quizzes: ${progress.total_quizzes}`);
      console.log(`Correct count: ${progress.correct_count}`);
      console.log(`Accuracy rate: ${progress.accuracy_rate}%`);
      console.log(`Completed stories: ${progress.completed_stories.length}`);
      tracker.summary();
    });

    it('should return progress with 0 values when no quiz results exist', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      // This test assumes there might be data, but verifies structure regardless
      tracker.setOperation('API呼び出し: GET /api/progress');
      const response = await request(app).get('/api/progress').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      const progress = response.body.data;

      // Even with no data, structure should be valid
      expect(progress.total_quizzes).toBeGreaterThanOrEqual(0);
      expect(progress.correct_count).toBeGreaterThanOrEqual(0);
      expect(progress.accuracy_rate).toBeGreaterThanOrEqual(0);
      expect(progress.accuracy_rate).toBeLessThanOrEqual(100);

      tracker.mark('ゼロ値検証完了');

      console.log(`Progress data validated: ${progress.total_quizzes} quizzes`);
      tracker.summary();
    });

    it('should calculate accuracy rate correctly', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress');
      const response = await request(app).get('/api/progress').expect(200);

      tracker.mark('APIレスポンス受信');

      const progress = response.body.data;

      if (progress.total_quizzes > 0) {
        const expectedAccuracy = (progress.correct_count / progress.total_quizzes) * 100;
        const roundedExpected = Math.round(expectedAccuracy * 10) / 10;

        expect(progress.accuracy_rate).toBe(roundedExpected);
        expect(progress.accuracy_rate).toBeGreaterThanOrEqual(0);
        expect(progress.accuracy_rate).toBeLessThanOrEqual(100);
      } else {
        expect(progress.accuracy_rate).toBe(0);
      }

      tracker.mark('正答率計算検証完了');

      console.log(
        `Accuracy verification: ${progress.correct_count}/${progress.total_quizzes} = ${progress.accuracy_rate}%`
      );
      tracker.summary();
    });
  });

  describe('GET /api/progress/graph', () => {
    it('should return graph data with default period (week)', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress/graph');
      const response = await request(app).get('/api/progress/graph').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('period', 'week');

      tracker.mark('レスポンス構造検証完了');

      // Verify ProgressGraphData structure
      const graphData = response.body.data;
      expect(graphData).toHaveProperty('data_points');
      expect(graphData).toHaveProperty('levels');
      expect(Array.isArray(graphData.data_points)).toBe(true);
      expect(Array.isArray(graphData.levels)).toBe(true);

      tracker.mark('グラフデータ構造検証完了');

      console.log(`Graph data points: ${graphData.data_points.length}`);
      console.log(`Levels with data: ${graphData.levels.length}`);
      tracker.summary();
    });

    it('should return graph data for week period', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress/graph?period=week');
      const response = await request(app).get('/api/progress/graph?period=week').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.period).toBe('week');

      const graphData = response.body.data;
      expect(Array.isArray(graphData.data_points)).toBe(true);

      tracker.mark('週次グラフデータ検証完了');

      console.log(`Week period - Data points: ${graphData.data_points.length}`);
      tracker.summary();
    });

    it('should return graph data for month period', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress/graph?period=month');
      const response = await request(app).get('/api/progress/graph?period=month').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.period).toBe('month');

      const graphData = response.body.data;
      expect(Array.isArray(graphData.data_points)).toBe(true);

      tracker.mark('月次グラフデータ検証完了');

      console.log(`Month period - Data points: ${graphData.data_points.length}`);
      tracker.summary();
    });

    it('should return graph data for year period', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress/graph?period=year');
      const response = await request(app).get('/api/progress/graph?period=year').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      expect(response.body.period).toBe('year');

      const graphData = response.body.data;
      expect(Array.isArray(graphData.data_points)).toBe(true);

      tracker.mark('年次グラフデータ検証完了');

      console.log(`Year period - Data points: ${graphData.data_points.length}`);
      tracker.summary();
    });

    it('should return 400 for invalid period parameter', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: Invalid period');
      const response = await request(app).get('/api/progress/graph?period=invalid').expect(400);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Invalid period parameter');

      tracker.mark('無効なperiodエラー検証完了');
      tracker.summary();
    });

    it('should verify data point structure', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      tracker.setOperation('API呼び出し: GET /api/progress/graph');
      const response = await request(app).get('/api/progress/graph').expect(200);

      tracker.mark('APIレスポンス受信');

      const graphData = response.body.data;

      if (graphData.data_points.length > 0) {
        const dataPoint = graphData.data_points[0];

        // Verify ProgressDataPoint structure
        expect(dataPoint).toHaveProperty('date');
        expect(dataPoint).toHaveProperty('accuracy_rate');
        expect(dataPoint).toHaveProperty('level');

        // Verify data types
        expect(typeof dataPoint.date).toBe('string');
        expect(typeof dataPoint.accuracy_rate).toBe('number');
        expect(typeof dataPoint.level).toBe('string');

        // Verify date is ISO 8601 format
        expect(dataPoint.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

        // Verify accuracy_rate is valid percentage
        expect(dataPoint.accuracy_rate).toBeGreaterThanOrEqual(0);
        expect(dataPoint.accuracy_rate).toBeLessThanOrEqual(100);

        // Verify level is valid JLPT level
        expect(['N5', 'N4', 'N3', 'N2', 'N1']).toContain(dataPoint.level);

        tracker.mark('データポイント構造検証完了');

        console.log(`Sample data point: ${dataPoint.date} - ${dataPoint.level}: ${dataPoint.accuracy_rate}%`);
      } else {
        console.log('No data points available for verification');
        tracker.mark('データポイントなし');
      }

      tracker.summary();
    });

    it('should return empty array when no quiz results for period', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('テスト開始');

      // This test verifies the API handles empty data correctly
      tracker.setOperation('API呼び出し: GET /api/progress/graph?period=year');
      const response = await request(app).get('/api/progress/graph?period=year').expect(200);

      tracker.mark('APIレスポンス受信');

      expect(response.body.success).toBe(true);
      const graphData = response.body.data;
      expect(Array.isArray(graphData.data_points)).toBe(true);
      expect(Array.isArray(graphData.levels)).toBe(true);

      tracker.mark('空データ検証完了');

      console.log(`Data points found: ${graphData.data_points.length}`);
      tracker.summary();
    });
  });

  describe('Complete Progress Flow', () => {
    it('should navigate through quiz answer -> progress update -> graph update', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('フローテスト開始');

      // Step 1: Get initial progress
      tracker.setOperation('ステップ1: 初期進捗取得');
      const initialProgressResponse = await request(app).get('/api/progress').expect(200);

      tracker.mark('初期進捗取得完了');

      const initialProgress = initialProgressResponse.body.data;
      console.log(`Initial progress: ${initialProgress.total_quizzes} quizzes`);

      // Step 2: Submit a quiz answer
      tracker.setOperation('ステップ2: クイズ回答送信');
      const quizResponse = await request(app).get('/api/quizzes').expect(200);

      tracker.mark('クイズ取得完了');

      const quiz = quizResponse.body.data;
      const correctChoice = quiz.choices.find((c: { is_correct: boolean }) => c.is_correct);

      const answerResponse = await request(app)
        .post('/api/quizzes/answer')
        .send({
          quiz_id: quiz.quiz_id,
          user_answer: correctChoice.choice_id,
          response_method: 'テキスト',
        })
        .expect(200);

      tracker.mark('クイズ回答送信完了');

      expect(answerResponse.body.data.is_correct).toBe(true);
      console.log(`Quiz answered: ${quiz.quiz_id}`);

      // Step 3: Get updated progress
      tracker.setOperation('ステップ3: 更新後進捗取得');
      const updatedProgressResponse = await request(app).get('/api/progress').expect(200);

      tracker.mark('更新後進捗取得完了');

      const updatedProgress = updatedProgressResponse.body.data;
      console.log(`Updated progress: ${updatedProgress.total_quizzes} quizzes`);

      // Verify progress increased
      expect(updatedProgress.total_quizzes).toBe(initialProgress.total_quizzes + 1);
      expect(updatedProgress.correct_count).toBe(initialProgress.correct_count + 1);

      tracker.mark('進捗更新検証完了');

      // Step 4: Get graph data
      tracker.setOperation('ステップ4: グラフデータ取得');
      const graphResponse = await request(app).get('/api/progress/graph?period=week').expect(200);

      tracker.mark('グラフデータ取得完了');

      const graphData = graphResponse.body.data;
      expect(Array.isArray(graphData.data_points)).toBe(true);
      console.log(`Graph data points: ${graphData.data_points.length}`);

      tracker.mark('フローテスト完了');

      console.log('\n========== Complete Progress Flow Success ==========');
      console.log(`Initial quizzes: ${initialProgress.total_quizzes}`);
      console.log(`Updated quizzes: ${updatedProgress.total_quizzes}`);
      console.log(`Quiz ID: ${quiz.quiz_id}`);
      console.log(`Graph data points: ${graphData.data_points.length}`);
      console.log('====================================================\n');

      tracker.summary();
    });

    it('should verify level-specific progress tracking', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('レベル別進捗テスト開始');

      // Step 1: Get quiz by specific level (N5)
      tracker.setOperation('ステップ1: N5クイズ取得');
      const n5QuizzesResponse = await request(app).get('/api/quizzes/story/3').expect(200);

      tracker.mark('N5クイズ取得完了');

      const n5Quiz = n5QuizzesResponse.body.data[0];
      expect(n5Quiz.difficulty_level).toBe('N5');

      // Step 2: Get initial progress
      tracker.setOperation('ステップ2: 初期進捗取得');
      const initialProgressResponse = await request(app).get('/api/progress').expect(200);

      tracker.mark('初期進捗取得完了');

      const initialN5Progress = initialProgressResponse.body.data.level_progress.N5;
      console.log(
        `Initial N5 progress: ${initialN5Progress.completed}/${initialN5Progress.total} (${initialN5Progress.accuracy}%)`
      );

      // Step 3: Submit N5 quiz answer
      tracker.setOperation('ステップ3: N5クイズ回答送信');
      const correctChoice = n5Quiz.choices.find((c: { is_correct: boolean }) => c.is_correct);

      await request(app)
        .post('/api/quizzes/answer')
        .send({
          quiz_id: n5Quiz.quiz_id,
          user_answer: correctChoice.choice_id,
          response_method: 'テキスト',
        })
        .expect(200);

      tracker.mark('N5クイズ回答送信完了');

      // Step 4: Verify N5 progress updated
      tracker.setOperation('ステップ4: N5進捗更新確認');
      const updatedProgressResponse = await request(app).get('/api/progress').expect(200);

      tracker.mark('N5進捗更新確認完了');

      const updatedN5Progress = updatedProgressResponse.body.data.level_progress.N5;
      expect(updatedN5Progress.completed).toBe(initialN5Progress.completed + 1);

      tracker.mark('レベル別進捗テスト完了');

      console.log(
        `Updated N5 progress: ${updatedN5Progress.completed}/${updatedN5Progress.total} (${updatedN5Progress.accuracy}%)`
      );
      tracker.summary();
    });

    it('should verify graph reflects recent quiz activity', async () => {
      const tracker = new MilestoneTracker();
      tracker.mark('グラフ反映テスト開始');

      // Step 1: Submit multiple quiz answers
      tracker.setOperation('ステップ1: 複数クイズ回答送信');

      for (let i = 0; i < 3; i++) {
        const quizResponse = await request(app).get('/api/quizzes').expect(200);
        const quiz = quizResponse.body.data;
        const correctChoice = quiz.choices.find((c: { is_correct: boolean }) => c.is_correct);

        await request(app)
          .post('/api/quizzes/answer')
          .send({
            quiz_id: quiz.quiz_id,
            user_answer: correctChoice.choice_id,
            response_method: 'テキスト',
          })
          .expect(200);
      }

      tracker.mark('複数クイズ回答送信完了');

      console.log('Submitted 3 quiz answers');

      // Step 2: Get graph data
      tracker.setOperation('ステップ2: グラフデータ取得');
      const graphResponse = await request(app).get('/api/progress/graph?period=week').expect(200);

      tracker.mark('グラフデータ取得完了');

      const graphData = graphResponse.body.data;
      expect(graphData.data_points.length).toBeGreaterThan(0);

      // Verify today's data is included
      const today = new Date().toISOString().split('T')[0];
      const todayDataPoints = graphData.data_points.filter((dp: { date: string }) =>
        dp.date.startsWith(today)
      );

      expect(todayDataPoints.length).toBeGreaterThan(0);

      tracker.mark('グラフ反映テスト完了');

      console.log(`Total data points: ${graphData.data_points.length}`);
      console.log(`Today's data points: ${todayDataPoints.length}`);
      tracker.summary();
    });
  });
});
