import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  LEVEL_CHECK_QUESTIONS,
  LEVEL_RESULT_TEXT,
  evaluateLevel,
} from '@/data/levelCheck';

type Phase = 'quiz' | 'result';

export function LevelCheckPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('quiz');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = LEVEL_CHECK_QUESTIONS[current];
  const progress = ((current) / LEVEL_CHECK_QUESTIONS.length) * 100;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const isCorrect = selected === question.correctIndex;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 >= LEVEL_CHECK_QUESTIONS.length) {
      const correctCount = newAnswers.filter(Boolean).length;
      const result = evaluateLevel(correctCount);
      localStorage.setItem('lingo_keeper_level_check_result', JSON.stringify({ result, correctCount, date: new Date().toISOString() }));
      setPhase('result');
    } else {
      setCurrent((c) => c + 1);
    }
  };

  if (phase === 'result') {
    const correctCount = answers.filter(Boolean).length;
    const result = evaluateLevel(correctCount);
    const resultInfo = LEVEL_RESULT_TEXT[result];

    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 560, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          {resultInfo.title}
        </Typography>
        <Typography variant="h2" sx={{ my: 3 }}>
          {correctCount} / {LEVEL_CHECK_QUESTIONS.length}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {resultInfo.message}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
          {LEVEL_CHECK_QUESTIONS.map((q, i) => (
            <Box key={q.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textAlign: 'left' }}>
              {answers[i] ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
              <Typography variant="body2">{q.question}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setPhase('quiz'); }}>
            Try Again
          </Button>
          <Button variant="contained" onClick={() => navigate(resultInfo.path)}>
            {resultInfo.action}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          Level Check
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Question {current + 1} of {LEVEL_CHECK_QUESTIONS.length}
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            {question.question}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {question.options.map((opt, idx) => {
              let variant: 'outlined' | 'contained' = 'outlined';
              let color: 'primary' | 'success' | 'error' = 'primary';
              if (selected !== null) {
                if (idx === question.correctIndex) color = 'success';
                else if (idx === selected) color = 'error';
              }
              if (selected === idx || (selected !== null && idx === question.correctIndex)) {
                variant = 'contained';
              }
              return (
                <Button
                  key={idx}
                  fullWidth
                  variant={variant}
                  color={color}
                  onClick={() => handleSelect(idx)}
                  sx={{ justifyContent: 'flex-start', px: 3, py: 1.5, fontSize: '1rem' }}
                >
                  {opt}
                </Button>
              );
            })}
          </Box>
          {selected !== null && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {question.explanation}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        fullWidth
        disabled={selected === null}
        onClick={handleNext}
        size="large"
      >
        {current + 1 === LEVEL_CHECK_QUESTIONS.length ? 'See Results' : 'Next Question'}
      </Button>
    </Box>
  );
}
