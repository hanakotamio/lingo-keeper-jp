import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

interface PermissionGateProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
  fallback?: ReactNode;
}

/**
 * 権限に基づいてコンテンツの表示を制御するコンポーネント
 * ルート全体の保護にはProtectedRouteを使用してください
 */
export const PermissionGate = ({ children, requiredRole, fallback = null }: PermissionGateProps) => {
  const { isAuthenticated, user } = useAuth();

  // 未認証の場合
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // 権限チェック
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
