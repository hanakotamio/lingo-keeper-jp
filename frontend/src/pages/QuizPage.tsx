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
  Mic as MicIcon,
  MicOff as MicOffIcon,
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
  const [isListening, setIsListening] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize voice recognition
  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 5; // Increased for better accuracy

      recognition.onresult = (event) => {
        // Get all alternative transcripts
        const alternatives = Array.from(event.results[0])
          .map(alt => alt.transcript.trim())
          .filter(Boolean);

        logger.info('Voice input received', {
          alternatives,
          confidence: event.results[0][0].confidence
        });

        // Match voice input with choices
        const quiz = quizzes[currentQuizIndex];
        if (quiz && !showFeedback) {
          let matchedChoice = null;

          // Helper function to normalize text for comparison
          const normalize = (text: string) => {
            return text
              .toLowerCase()
              .replace(/[、。！？\s]/g, '') // Remove Japanese punctuation and spaces
              .trim();
          };

          // Try all alternatives
          for (const transcript of alternatives) {
            // Try to match with choice letter (A, B, C, D) - Japanese or English
            const letterMatch = transcript.match(/([abcdａｂｃｄエー|ビー|シー|ディー])/i);
            if (letterMatch) {
              const letter = letterMatch[1].toUpperCase();
              let index = -1;

              // Map Japanese letters to index
              if (letter === 'エー' || letter === 'A' || letter === 'Ａ') index = 0;
              else if (letter === 'ビー' || letter === 'B' || letter === 'Ｂ') index = 1;
              else if (letter === 'シー' || letter === 'C' || letter === 'Ｃ') index = 2;
              else if (letter === 'ディー' || letter === 'D' || letter === 'Ｄ') index = 3;
              else if (letter >= 'A' && letter <= 'D') {
                index = letter.charCodeAt(0) - 65;
              }

              if (index >= 0 && index < quiz.choices.length) {
                matchedChoice = quiz.choices[index];
                logger.info('Matched by letter', { letter, index, choice: matchedChoice.choice_text });
                break;
              }
            }

            // Try to match with choice text
            const normalizedTranscript = normalize(transcript);

            // Find best match using multiple strategies
            const scores = quiz.choices.map((choice, idx) => {
              const normalizedChoice = normalize(choice.choice_text);
              let score = 0;

              // Exact match (highest score)
              if (normalizedTranscript === normalizedChoice) {
                score = 100;
              }
              // Contains match
              else if (normalizedTranscript.includes(normalizedChoice) ||
                       normalizedChoice.includes(normalizedTranscript)) {
                score = 80;
              }
              // Partial match (calculate similarity)
              else {
                // Count matching characters
                let matches = 0;
                const shorter = normalizedTranscript.length < normalizedChoice.length
                  ? normalizedTranscript
                  : normalizedChoice;
                const longer = normalizedTranscript.length >= normalizedChoice.length
                  ? normalizedTranscript
                  : normalizedChoice;

                for (let i = 0; i < shorter.length; i++) {
                  if (longer.includes(shorter[i])) {
                    matches++;
                  }
                }

                score = (matches / longer.length) * 60;
              }

              return { choice, score, idx };
            });

            // Sort by score
            scores.sort((a, b) => b.score - a.score);

            logger.info('Match scores', {
              transcript: normalizedTranscript,
              scores: scores.map(s => ({
                text: s.choice.choice_text,
                score: s.score.toFixed(2)
              }))
            });

            // Use best match if score is high enough
            if (scores[0].score >= 50) {
              matchedChoice = scores[0].choice;
              logger.info('Matched by similarity', {
                score: scores[0].score,
                choice: matchedChoice.choice_text
              });
              break;
            }
          }

          if (matchedChoice) {
            handleAnswerSelect(matchedChoice.choice_id);
          } else {
            logger.warn('No matching choice found', { alternatives });
            alert('回答が認識できませんでした。もう一度試すか、選択肢をクリックしてください。\n(Could not match your answer. Please try again or click an option.)');
          }
        }

        setIsListening(false);
      };

      recognition.onerror = (event) => {
        logger.error('Voice recognition error', { error: event.error });
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions.');
        } else {
          alert('Voice recognition error. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setVoiceRecognition(recognition);
    } else {
      logger.warn('Speech Recognition not supported');
    }

    return () => {
      if (voiceRecognition) {
        voiceRecognition.stop();
      }
    };
  }, [quizzes, currentQuizIndex, showFeedback]);

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

  // Handle voice input
  const handleVoiceInput = () => {
    if (!voiceRecognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
    } else {
      try {
        voiceRecognition.start();
        setIsListening(true);
        logger.info('Voice recognition started');
      } catch (error) {
        logger.error('Failed to start voice recognition', { error });
        setIsListening(false);
      }
    }
  };

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
      const existingResults = localStorage.getItem('lingo_keeper_quiz_results');
      const allResults = existingResults ? JSON.parse(existingResults) : [];
      allResults.push(result);
      localStorage.setItem('lingo_keeper_quiz_results', JSON.stringify(allResults));

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

            {/* Voice Input Button */}
            {!showFeedback && voiceRecognition && (
              <Box mt={3} textAlign="center">
                <Button
                  variant={isListening ? 'contained' : 'outlined'}
                  color={isListening ? 'secondary' : 'primary'}
                  startIcon={isListening ? <MicIcon /> : <MicOffIcon />}
                  onClick={handleVoiceInput}
                  sx={{
                    px: 3,
                    ...(isListening && {
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                      },
                    }),
                  }}
                >
                  {isListening ? '聞いています...' : '音声で回答'}
                </Button>
                <Typography variant="caption" display="block" mt={1} color="text.secondary">
                  選択肢の文字（A、B、C、D）または答えの文を言ってください
                </Typography>
              </Box>
            )}
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
