import { Typography, Box, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          プロフィール
        </Typography>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ユーザー情報
            </Typography>
            <Typography variant="body1">
              ユーザー名: {user?.username}
            </Typography>
            <Typography variant="body1">
              メールアドレス: {user?.email}
            </Typography>
            <Typography variant="body1">
              ロール: {user?.role === 'admin' ? '管理者' : 'ユーザー'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};
