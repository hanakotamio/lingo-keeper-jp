import { Typography, Box, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('profile.title')}
        </Typography>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('profile.userInfo')}
            </Typography>
            <Typography variant="body1">
              {t('profile.username')}: {user?.username}
            </Typography>
            <Typography variant="body1">
              {t('profile.email')}: {user?.email}
            </Typography>
            <Typography variant="body1">
              {t('profile.role')}: {user?.role === 'admin' ? t('profile.admin') : t('profile.user')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};
