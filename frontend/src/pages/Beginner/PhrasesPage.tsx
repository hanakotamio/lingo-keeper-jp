import { useState } from 'react';
import { Box, Card, CardContent, IconButton, Tab, Tabs, Typography } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { PHRASE_CATEGORIES, type Phrase } from '@/data/phrases';
import { TTSApiService } from '@/services/api/TTSApiService';

function PhraseCard({ phrase }: { phrase: Phrase }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      const { audioUrl } = await TTSApiService.synthesizeSpeech(phrase.japanese);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlaying(false);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.15s ease',
        '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            {phrase.japanese}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            {phrase.furigana}
          </Typography>
          <Typography variant="body2" color="primary.main" fontStyle="italic">
            {phrase.english}
          </Typography>
        </Box>
        <IconButton
          onClick={handlePlay}
          size="medium"
          sx={{
            color: playing ? 'primary.main' : 'text.secondary',
            bgcolor: playing ? 'primary.main' + '18' : 'transparent',
            '&:hover': { bgcolor: 'primary.main' + '18', color: 'primary.main' },
          }}
        >
          <VolumeUpIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export function PhrasesPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          Basic Phrases
        </Typography>
        <Typography variant="h6" color="text.secondary">
          挨拶・会話表現
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Click the speaker icon to hear the pronunciation.
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {PHRASE_CATEGORIES.map((cat) => (
          <Tab key={cat.label} label={cat.label} />
        ))}
      </Tabs>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {PHRASE_CATEGORIES[tab].phrases.map((phrase) => (
          <PhraseCard key={phrase.japanese} phrase={phrase} />
        ))}
      </Box>
    </Box>
  );
}
