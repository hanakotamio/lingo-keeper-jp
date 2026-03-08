import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import QuizIcon from '@mui/icons-material/Quiz';

interface BeginnerCard {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  preview: string;
  path: string;
  color: string;
}

const CARDS: BeginnerCard[] = [
  {
    title: 'Hiragana',
    subtitle: 'ひらがな表',
    icon: <SchoolIcon sx={{ fontSize: 48 }} />,
    preview: 'あいうえお',
    path: '/beginner/hiragana',
    color: '#7A9C5E',
  },
  {
    title: 'Katakana',
    subtitle: 'カタカナ表',
    icon: <RecordVoiceOverIcon sx={{ fontSize: 48 }} />,
    preview: 'アイウエオ',
    path: '/beginner/katakana',
    color: '#A67C52',
  },
  {
    title: 'Basic Phrases',
    subtitle: '挨拶・会話表現',
    icon: <ChatBubbleIcon sx={{ fontSize: 48 }} />,
    preview: 'こんにちは',
    path: '/beginner/phrases',
    color: '#5E8CA6',
  },
  {
    title: 'Level Check',
    subtitle: 'レベル判定クイズ',
    icon: <QuizIcon sx={{ fontSize: 48 }} />,
    preview: '？',
    path: '/beginner/level-check',
    color: '#9C7A5E',
  },
];

export function BeginnerPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          Start Your Japanese Journey
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          日本語の旅を始めよう！
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
          New to Japanese? Start here. Learn the alphabet, basic phrases, and find your level before diving into stories.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {CARDS.map((card) => (
          <Grid size={{ xs: 12, sm: 6 }} key={card.path}>
            <Card
              onClick={() => navigate(card.path)}
              sx={{
                cursor: 'pointer',
                height: '100%',
                border: '2px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${card.color}33`,
                  border: `2px solid ${card.color}`,
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ color: card.color, mb: 2 }}>{card.icon}</Box>
                <Typography
                  variant="h2"
                  sx={{ fontFamily: 'serif', color: card.color, mb: 1, letterSpacing: 4 }}
                >
                  {card.preview}
                </Typography>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
