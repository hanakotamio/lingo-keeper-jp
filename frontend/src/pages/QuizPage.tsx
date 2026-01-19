import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowForward as ArrowForwardIcon,
  QuizOutlined as QuizIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { QuizApiService } from '@/services/api/QuizApiService';
import type { Quiz, UserQuizResult } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Quiz Page
 *
 * Displays comprehension check questions for a story
 * - Fetches quizzes by story_id from URL params
 * - Shows questions one by one
 * - Provides immediate feedback on answers
 * - Saves results to LocalStorage
 * - Returns to story experience page after completion
 */
export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get('story');
  const returnTo = searchParams.get('returnTo') || '/story-experience';
  const fromCompletion = searchParams.get('fromCompletion') === 'true';

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [results, setResults] = useState<UserQuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load quizzes when component mounts
  useEffect(() => {
    const loadQuizzes = async () => {
      if (!storyId) {
        setError('Story ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedQuizzes = await QuizApiService.getQuizzesByStory(storyId);

        if (fetchedQuizzes.length === 0) {
          setError('No quizzes available for this story');
        } else {
          setQuizzes(fetchedQuizzes);
        }

        setLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load quizzes';
        logger.error('Failed to load quizzes', { error: errorMsg, storyId });
        setError(errorMsg);
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [storyId]);

  // Handle answer selection
  const handleAnswerSelect = (choiceId: string) => {
    if (!showFeedback) {
      setSelectedAnswer(choiceId);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuiz = quizzes[currentQuizIndex];
    const selectedChoice = currentQuiz.choices.find(c => c.choice_id === selectedAnswer);

    if (selectedChoice) {
      setIsCorrect(selectedChoice.is_correct);
      setExplanation(selectedChoice.explanation || '');
      setShowFeedback(true);

      // Save result to state
      const result: UserQuizResult = {
        result_id: `result-${Date.now()}`,
        quiz_id: currentQuiz.quiz_id,
        user_answer: selectedChoice.choice_text,
        is_correct: selectedChoice.is_correct,
        answered_at: new Date().toISOString(),
        response_method: 'テキスト',
      };
      setResults(prev => [...prev, result]);

      // Save to LocalStorage
      const existingResults = localStorage.getItem(`lingo_keeper_quiz_results_${storyId}`);
      const allResults = existingResults ? JSON.parse(existingResults) : [];
      allResults.push(result);
      localStorage.setItem(`lingo_keeper_quiz_results_${storyId}`, JSON.stringify(allResults));

      logger.info('Quiz answer submitted', {
        quizId: currentQuiz.quiz_id,
        isCorrect: selectedChoice.is_correct,
      });
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setExplanation('');
    } else {
      // Quiz completed, return to story page
      handleComplete();
    }
  };

  // Handle quiz completion
  const handleComplete = () => {
    // Add completion flag to URL
    const completionUrl = `${returnTo}?quizCompleted=true&storyId=${storyId}`;
    navigate(completionUrl);
  };

  // Calculate progress
  const progress = quizzes.length > 0 ? ((currentQuizIndex + 1) / quizzes.length) * 100 : 0;
  const currentQuiz = quizzes[currentQuizIndex];

  // Render loading state
  if (loading) {
    return (
      <PublicLayout maxWidth="md">
        <Box textAlign="center" p={4}>
          <Box
            sx={{
              width: 40,
              height: 40,
              border: '4px solid',
              borderColor: 'primary.light',
              borderTopColor: 'primary.main',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Typography variant="body1">Loading quiz...</Typography>
        </Box>
      </PublicLayout>
    );
  }

  // Render error state
  if (error || !currentQuiz) {
    return (
      <PublicLayout maxWidth="md">
        <Container maxWidth="md" sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Quiz not found'}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/story-experience')}>
            Back to Stories
          </Button>
        </Container>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout maxWidth="md">
      <Container maxWidth="md" sx={{ p: 2 }}>
        {/* Header */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <QuizIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {fromCompletion ? 'Comprehension Check' : 'Quiz'}
            </Typography>
          </Box>

          {fromCompletion && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Great job completing the story! Now let's check your understanding.
            </Alert>
          )}

          {/* Progress */}
          <Box my={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuizIndex + 1} of {quizzes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Question Type & Difficulty */}
          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={currentQuiz.question_type}
              color="primary"
              size="small"
            />
            <Chip
              label={currentQuiz.difficulty_level}
              color="secondary"
              size="small"
            />
          </Box>
        </Box>

        {/* Question */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h2" mb={3}>
              {currentQuiz.question_text}
            </Typography>

            {/* Choices */}
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswer || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              >
                {currentQuiz.choices.map((choice, index) => (
                  <Card
                    key={choice.choice_id}
                    sx={{
                      mb: 2,
                      cursor: showFeedback ? 'default' : 'pointer',
                      border: 2,
                      borderColor:
                        selectedAnswer === choice.choice_id
                          ? 'primary.main'
                          : 'divider',
                      bgcolor:
                        showFeedback && choice.is_correct
                          ? 'rgba(76, 175, 80, 0.1)'
                          : showFeedback && selectedAnswer === choice.choice_id && !choice.is_correct
                          ? 'rgba(244, 67, 54, 0.1)'
                          : 'background.paper',
                      '&:hover': {
                        borderColor: showFeedback ? undefined : 'primary.light',
                      },
                    }}
                    onClick={() => !showFeedback && handleAnswerSelect(choice.choice_id)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <FormControlLabel
                          value={choice.choice_id}
                          control={<Radio />}
                          label={
                            <Typography variant="body1">
                              {String.fromCharCode(65 + index)}. {choice.choice_text}
                            </Typography>
                          }
                          disabled={showFeedback}
                        />
                        {showFeedback && choice.is_correct && (
                          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28 }} />
                        )}
                        {showFeedback && selectedAnswer === choice.choice_id && !choice.is_correct && (
                          <CancelIcon sx={{ color: 'error.main', fontSize: 28 }} />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Feedback */}
        {showFeedback && (
          <Alert
            severity={isCorrect ? 'success' : 'error'}
            icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body1" fontWeight="medium" mb={1}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </Typography>
            {explanation && (
              <Typography variant="body2">
                {explanation}
              </Typography>
            )}
          </Alert>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          {!showFeedback ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              sx={{ px: 4 }}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNextQuestion}
              sx={{ px: 4 }}
            >
              {currentQuizIndex < quizzes.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          )}
        </Box>

        {/* Quiz Summary (shown at the bottom) */}
        {results.length > 0 && (
          <Box mt={4} pt={3} borderTop={1} borderColor="divider">
            <Typography variant="body2" color="text.secondary">
              Correct Answers: {results.filter(r => r.is_correct).length} / {results.length}
            </Typography>
          </Box>
        )}
      </Container>
    </PublicLayout>
  );
};

export default QuizPage;
