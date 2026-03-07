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
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { DRAWER_WIDTH } from '@/layouts/MainLayout';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

interface MenuItemType {
  translationKey: string;
  icon: React.ReactNode;
  path: string;
  requiredRole?: 'user' | 'admin';
}

const menuItems: MenuItemType[] = [
  { translationKey: 'common.navigation.dashboard', icon: <DashboardIcon />, path: '/' },
  { translationKey: 'common.navigation.beginner', icon: <SchoolIcon />, path: '/beginner' },
  { translationKey: 'common.navigation.stories', icon: <MenuBookIcon />, path: '/stories' },
  { translationKey: 'common.navigation.quiz', icon: <QuizIcon />, path: '/quiz' },
  { translationKey: 'common.navigation.profile', icon: <PersonIcon />, path: '/profile' },
  { translationKey: 'common.navigation.admin', icon: <AdminPanelSettingsIcon />, path: '/admin', requiredRole: 'admin' },
];

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();
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
            <ListItem key={item.translationKey} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
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
                    color: (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) ? 'primary.contrastText' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.translationKey as any)} />
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
            primary={`${t('profile.roleLabel')}: ${user?.role === 'admin' ? t('profile.admin') : t('profile.user')}`}
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
