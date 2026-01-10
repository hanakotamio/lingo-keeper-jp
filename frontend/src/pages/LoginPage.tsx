import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PublicLayout } from '@/layouts/PublicLayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout title="ログイン">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          label="メールアドレス"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="パスワード"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormControlLabel
          control={
            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          }
          label="ログイン状態を保持する"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </Button>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            デモアカウント:
          </Typography>
          <Typography variant="body2">
            ユーザー: demo@example.com / demo123
          </Typography>
          <Typography variant="body2">
            管理者: admin@example.com / admin123
          </Typography>
        </Box>
      </Box>
    </PublicLayout>
  );
};
