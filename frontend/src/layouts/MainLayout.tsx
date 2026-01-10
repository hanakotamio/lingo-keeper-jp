import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const DRAWER_WIDTH = 240;

/**
 * 認証後ページ用メインレイアウト
 * Header + レスポンシブDrawerを含む
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header onMenuClick={handleDrawerToggle} />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Headerの高さ分のマージン
          ml: { md: `${DRAWER_WIDTH}px` }, // デスクトップ版でサイドバー幅分のマージン
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
