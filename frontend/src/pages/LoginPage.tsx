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
import { useI18n } from '@/hooks/useI18n';
import { PublicLayout } from '@/layouts/PublicLayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
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
      setError(err instanceof Error ? err.message : t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout title={t('auth.login')}>
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
          label={t('auth.email')}
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
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormControlLabel
          control={
            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          }
          label={t('auth.rememberMe')}
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </Button>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('auth.demoAccount')}:
          </Typography>
          <Typography variant="body2">
            {t('profile.user')}: demo@example.com / demo123
          </Typography>
          <Typography variant="body2">
            {t('profile.admin')}: admin@example.com / admin123
          </Typography>
        </Box>
      </Box>
    </PublicLayout>
  );
};
