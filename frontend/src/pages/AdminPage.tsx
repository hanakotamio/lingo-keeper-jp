import { Typography, Box, Alert } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';

export const AdminPage = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          管理画面
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          管理者専用ページです。ストーリーやクイズの管理機能をここに実装します。
        </Alert>

        <Typography variant="body2" sx={{ mt: 2 }}>
          （Phase 4: ページ実装で詳細機能を追加予定）
        </Typography>
      </Box>
    </MainLayout>
  );
};
