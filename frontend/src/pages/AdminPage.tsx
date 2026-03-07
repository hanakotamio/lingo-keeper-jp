import { Typography, Box, Alert } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { useI18n } from '@/hooks/useI18n';

export const AdminPage = () => {
  const { t } = useI18n();

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('admin.title')}
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          {t('admin.description')}
        </Alert>

        <Typography variant="body2" sx={{ mt: 2 }}>
          ({t('admin.phase4')})
        </Typography>
      </Box>
    </MainLayout>
  );
};
