import type { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';

interface PublicLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

/**
 * 公開ページ用レイアウト
 * ログイン、パスワードリセットなどの認証前ページで使用
 */
export const PublicLayout = ({ children, maxWidth = 'sm', title }: PublicLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', // Nature Inspiredのグリーン系グラデーション
      }}
    >
      {/* ヘッダー */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lingo Keeper JP
          </Typography>
        </Toolbar>
      </AppBar>

      {/* メインコンテンツエリア */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth={maxWidth}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            {title && (
              <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
                {title}
              </Typography>
            )}
            {children}
          </Paper>
        </Container>
      </Box>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2">
          © 2026 Lingo Keeper JP. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
