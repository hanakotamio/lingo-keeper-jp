import type { User } from '@/types';

// モックユーザーデータ
const MOCK_USERS = [
  {
    user_id: 'user-001',
    email: 'demo@example.com',
    username: 'Demo User',
    password: 'demo123', // 実際のプロダクションでは絶対に平文保存しない
    role: 'user' as const,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    user_id: 'admin-001',
    email: 'admin@example.com',
    username: 'Admin User',
    password: 'admin123',
    role: 'admin' as const,
    created_at: '2026-01-01T00:00:00Z',
  },
];

// モックトークン生成
const generateMockToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// ログイン
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<{ user: User; token: string }> => {
  // 実際のAPIリクエストをシミュレート（500msの遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockUser = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!mockUser) {
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  // パスワードを除いたユーザー情報を返す
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = mockUser;
  const token = generateMockToken(user.user_id);

  // Remember Meの場合、LocalStorageに保存
  if (rememberMe) {
    localStorage.setItem('lingo_keeper_remember_me', 'true');
  }

  return { user, token };
};

// ログアウト
export const logout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localStorage.removeItem('lingo_keeper_remember_me');
};

// トークン検証（モック）
export const validateToken = async (token: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // モックトークンの形式チェック
  return token.startsWith('mock_token_');
};

// トークンからユーザー情報を取得（モック）
export const getUserFromToken = async (token: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!token.startsWith('mock_token_')) {
    return null;
  }

  // トークンからユーザーIDを抽出（例: mock_token_user-001_1234567890）
  const parts = token.split('_');
  if (parts.length < 3) {
    return null;
  }

  const userId = parts[2];
  const mockUser = MOCK_USERS.find((u) => u.user_id === userId);

  if (!mockUser) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = mockUser;
  return user;
};

// トークンリフレッシュ（モック）
export const refreshToken = async (oldToken: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!oldToken.startsWith('mock_token_')) {
    throw new Error('Invalid token');
  }

  const parts = oldToken.split('_');
  const userId = parts[2];

  return generateMockToken(userId);
};
