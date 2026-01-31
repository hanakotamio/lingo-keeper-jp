import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { useEffect, useState } from 'react';
import { getCompletedStories, getQuizResults, getLearnerLevel } from '@/lib/storage';
import type { StoryCompletion, UserQuizResult, LearnerLevel } from '@/types';

export const DashboardPage = () => {
  const [completedStories, setCompletedStories] = useState<StoryCompletion[]>([]);
  const [quizResults, setQuizResults] = useState<UserQuizResult[]>([]);
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel | null>(null);

  useEffect(() => {
    // Load data from LocalStorage
    const loadDashboardData = () => {
      const stories = getCompletedStories();
      const results = getQuizResults();
      const level = getLearnerLevel();

      setCompletedStories(stories);
      setQuizResults(results);
      setLearnerLevel(level);
    };

    loadDashboardData();
  }, []);

  // Calculate overall quiz accuracy
  const calculateOverallAccuracy = (): number => {
    if (quizResults.length === 0) return 0;
    const correctCount = quizResults.filter(r => r.is_correct).length;
    return Math.round((correctCount / quizResults.length) * 100);
  };

  const overallAccuracy = calculateOverallAccuracy();

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          ダッシュボード
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">学習進捗</Typography>
                <Typography variant="body2" color="text.secondary">
                  完了したストーリー: {completedStories.length}
                </Typography>
                {completedStories.length > 0 && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    最後の完了: {new Date(completedStories[completedStories.length - 1].completed_at).toLocaleDateString('ja-JP')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">クイズ成績</Typography>
                <Typography variant="body2" color="text.secondary">
                  正答率: {overallAccuracy}%
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  解答数: {quizResults.length}問
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">現在のレベル</Typography>
                <Typography variant="body2" color="text.secondary">
                  JLPT: {learnerLevel?.current_level || 'N5'}
                </Typography>
                {learnerLevel && learnerLevel.confidence > 0 && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    確度: {learnerLevel.confidence}% | 推奨: {learnerLevel.recommended_next_level}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};
