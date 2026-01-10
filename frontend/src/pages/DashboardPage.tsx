import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';

export const DashboardPage = () => {
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
                  完了したストーリー: 0
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">クイズ成績</Typography>
                <Typography variant="body2" color="text.secondary">
                  正答率: 0%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">現在のレベル</Typography>
                <Typography variant="body2" color="text.secondary">
                  JLPT: N5 | CEFR: A1
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};
