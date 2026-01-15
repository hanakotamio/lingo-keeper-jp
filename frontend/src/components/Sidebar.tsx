import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DRAWER_WIDTH } from '@/layouts/MainLayout';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  path: string;
  requiredRole?: 'user' | 'admin';
}

const menuItems: MenuItemType[] = [
  { text: 'ダッシュボード', icon: <DashboardIcon />, path: '/' },
  { text: 'ストーリー', icon: <MenuBookIcon />, path: '/stories' },
  { text: 'クイズ', icon: <QuizIcon />, path: '/quiz' },
  { text: 'プロフィール', icon: <PersonIcon />, path: '/profile' },
  { text: '管理画面', icon: <AdminPanelSettingsIcon />, path: '/admin', requiredRole: 'admin' },
];

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  // 権限チェック
  const hasPermission = (requiredRole?: 'user' | 'admin'): boolean => {
    if (!requiredRole) return true;
    if (user?.role === 'admin') return true; // 管理者は全てにアクセス可能
    return user?.role === requiredRole;
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 1 }}>
      <List>
        {menuItems
          .filter((item) => hasPermission(item.requiredRole))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ px: 2, py: 1 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            backgroundColor: 'success.light',
            color: 'success.contrastText',
          }}
        >
          <ListItemText
            primary={`ロール: ${user?.role === 'admin' ? '管理者' : 'ユーザー'}`}
            secondary={user?.email}
            secondaryTypographyProps={{
              sx: { color: 'success.contrastText', opacity: 0.8 },
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* モバイル版: Temporary Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // モバイルパフォーマンス向上
          }}
          PaperProps={{
            component: 'nav',
            'aria-label': 'サイドバー',
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              top: 64, // Headerの高さ
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* デスクトップ版: Permanent Drawer */
        <Drawer
          variant="permanent"
          PaperProps={{
            component: 'nav',
            'aria-label': 'サイドバー',
          }}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              top: 64, // Headerの高さ
              height: 'calc(100% - 64px)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};
