import { Typography, Box } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';

export const QuizPage = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          理解度チェック＋進捗
        </Typography>
        <Typography variant="body1" color="text.secondary">
          音声クイズで理解度を確認し、進捗を可視化します。
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          （Phase 4: ページ実装で詳細機能を追加予定）
        </Typography>
      </Box>
    </MainLayout>
  );
};
