import { useState } from 'react';
import { Box, Chip, Paper, Tooltip, Typography } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { KanaRow } from '@/data/hiragana';
import { TTSApiService } from '@/services/api/TTSApiService';

interface KanaTablePageProps {
  title: string;
  titleJp: string;
  seion: KanaRow[];
  dakuten: KanaRow[];
  storageKey: string;
}

function KanaCell({
  char,
  romaji,
  storageKey,
}: {
  char: string;
  romaji: string;
  storageKey: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [learned, setLearned] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const data = saved ? JSON.parse(saved) : [];
      return data.includes(char);
    } catch {
      return false;
    }
  });

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) return;
    setPlaying(true);
    try {
      const { audioUrl } = await TTSApiService.synthesizeSpeech(char);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlaying(false);
    } catch {
      setPlaying(false);
    }
  };

  const handleToggleLearned = () => {
    const saved = localStorage.getItem(storageKey);
    const data: string[] = saved ? JSON.parse(saved) : [];
    const next = learned ? data.filter((c) => c !== char) : [...data, char];
    localStorage.setItem(storageKey, JSON.stringify(next));
    setLearned(!learned);
  };

  return (
    <Tooltip title={`Click speaker to hear "${char}" (${romaji})`} placement="top">
      <Paper
        elevation={0}
        onClick={handleToggleLearned}
        sx={{
          p: 1.5,
          textAlign: 'center',
          cursor: 'pointer',
          border: learned ? '2px solid' : '1px solid',
          borderColor: learned ? 'primary.main' : 'divider',
          bgcolor: learned ? 'primary.main' + '18' : 'background.paper',
          borderRadius: 2,
          transition: 'all 0.15s ease',
          position: 'relative',
          '&:hover': {
            bgcolor: 'primary.main' + '12',
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        {learned && (
          <CheckCircleIcon
            sx={{ position: 'absolute', top: 4, right: 4, fontSize: 14, color: 'primary.main' }}
          />
        )}
        <Typography variant="h5" fontWeight={700} lineHeight={1}>
          {char}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {romaji}
        </Typography>
        <VolumeUpIcon
          onClick={handlePlay}
          sx={{
            fontSize: 16,
            mt: 0.5,
            color: playing ? 'primary.main' : 'text.disabled',
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
        />
      </Paper>
    </Tooltip>
  );
}

export function KanaTablePage({ title, titleJp, seion, dakuten, storageKey }: KanaTablePageProps) {
  const totalChars = [...seion, ...dakuten].flatMap((r) => r.chars).filter(Boolean).length;
  const learnedCount = (() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as string[]).length : 0;
    } catch {
      return 0;
    }
  })();

  const renderRow = (row: KanaRow) => (
    <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography
        variant="caption"
        sx={{ width: 48, flexShrink: 0, color: 'text.secondary', fontWeight: 600 }}
      >
        {row.label}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, flex: 1 }}>
        {row.chars.map((cell, idx) =>
          cell ? (
            <KanaCell key={cell.char} char={cell.char} romaji={cell.romaji} storageKey={storageKey} />
          ) : (
            <Box key={idx} />
          )
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {titleJp}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Chip
            label={`${learnedCount} / ${totalChars} learned`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Click a character to mark it as learned. Click the speaker icon to hear the pronunciation.
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: 'text.primary' }}>
        Basic Sounds (清音)
      </Typography>
      <Box sx={{ mb: 4 }}>{seion.map(renderRow)}</Box>

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: 'text.primary' }}>
        Voiced Sounds (濁音・半濁音)
      </Typography>
      <Box>{dakuten.map(renderRow)}</Box>
    </Box>
  );
}
