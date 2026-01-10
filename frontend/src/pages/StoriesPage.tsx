import { Typography, Box } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';

export const StoriesPage = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          ストーリー体験
        </Typography>
        <Typography variant="body1" color="text.secondary">
          レベル別の分岐型ストーリーをお楽しみください。
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          （Phase 4: ページ実装で詳細機能を追加予定）
        </Typography>
      </Box>
    </MainLayout>
  );
};
