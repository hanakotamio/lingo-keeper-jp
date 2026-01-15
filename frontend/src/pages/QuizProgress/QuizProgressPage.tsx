import React, { useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Mic as MicIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useQuizData } from '@/hooks/useQuizData';
import { TTSApiService } from '@/services/api/TTSApiService';
import type { QuizViewerState, QuizFeedback } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Quiz Progress Page
 *
 * This page provides:
 * - Voice quiz with TTS (Text-to-Speech)
 * - Voice answer with Web Speech API
 * - Text display toggle (audio only / audio + text)
 * - Immediate feedback (correct/incorrect, explanation)
 * - Accuracy rate display
 * - Learning history (completed stories, accuracy)
 * - Level-based progress graph (line chart)
 * - Recommended story suggestions
 *
 * Layout: PublicLayout (no authentication required)
 */

// Initial state for quiz viewer
const initialState: QuizViewerState = {
  currentQuizId: null,
  userAnswer: null,
  isCorrect: null,
  showFeedback: false,
  showQuestionText: false,
  isVoiceRecording: false,
  voiceRecognitionResult: null,
  inputMethod: '音声',
  isAudioPlaying: false,
  isLoading: false,
};

// Reducer for quiz viewer state management
type QuizViewerAction =
  | { type: 'SET_QUIZ_ID'; payload: string }
  | { type: 'SET_USER_ANSWER'; payload: string }
  | { type: 'SET_FEEDBACK'; payload: QuizFeedback }
  | { type: 'TOGGLE_QUESTION_TEXT' }
  | { type: 'SET_VOICE_RECORDING'; payload: boolean }
  | { type: 'SET_VOICE_RESULT'; payload: string }
  | { type: 'SWITCH_INPUT_METHOD'; payload: '音声' | 'テキスト' }
  | { type: 'SET_AUDIO_PLAYING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_STATE' };

function quizViewerReducer(state: QuizViewerState, action: QuizViewerAction): QuizViewerState {
  switch (action.type) {
    case 'SET_QUIZ_ID':
      return { ...state, currentQuizId: action.payload };
    case 'SET_USER_ANSWER':
      return { ...state, userAnswer: action.payload };
    case 'SET_FEEDBACK':
      return {
        ...state,
        isCorrect: action.payload.is_correct,
        showFeedback: true,
      };
    case 'TOGGLE_QUESTION_TEXT':
      return { ...state, showQuestionText: !state.showQuestionText };
    case 'SET_VOICE_RECORDING':
      return { ...state, isVoiceRecording: action.payload };
    case 'SET_VOICE_RESULT':
      return { ...state, voiceRecognitionResult: action.payload };
    case 'SWITCH_INPUT_METHOD':
      return { ...state, inputMethod: action.payload };
    case 'SET_AUDIO_PLAYING':
      return { ...state, isAudioPlaying: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_STATE':
      return { ...initialState, currentQuizId: state.currentQuizId };
    default:
      return state;
  }
}

export const QuizProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(quizViewerReducer, initialState);
  const [manualAnswer, setManualAnswer] = useState('');
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Get story ID from URL parameter
  const searchParams = new URLSearchParams(window.location.search);
  const storyId = searchParams.get('story') || undefined;

  const {
    currentQuiz,
    progress,
    graphData,
    completionHistory,
    recommendedStory,
    loading,
    submitAnswer,
    loadNextQuiz,
    refreshGraphData,
  } = useQuizData(storyId);

  // Set current quiz ID when quiz loads
  useEffect(() => {
    if (currentQuiz) {
      dispatch({ type: 'SET_QUIZ_ID', payload: currentQuiz.quiz_id });
    }
  }, [currentQuiz]);

  // Handle audio playback
  const handleAudioPlay = async () => {
    if (!currentQuiz) return;

    try {
      dispatch({ type: 'SET_AUDIO_PLAYING', payload: true });
      logger.debug('Playing quiz audio');

      const { audioUrl } = await TTSApiService.synthesizeSpeech(currentQuiz.question_text);

      // Play the audio
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        dispatch({ type: 'SET_AUDIO_PLAYING', payload: false });
      };
      audio.onerror = () => {
        logger.error('Audio playback failed');
        dispatch({ type: 'SET_AUDIO_PLAYING', payload: false });
      };
      await audio.play();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to play audio', { error: error.message });
      dispatch({ type: 'SET_AUDIO_PLAYING', payload: false });
    }
  };

  // Handle sample answer audio playback
  const handlePlayAudio = async (text: string) => {
    if (!text) return;

    try {
      logger.debug('Playing sample answer audio', { text });

      const { audioUrl } = await TTSApiService.synthesizeSpeech(text);

      // Play the audio
      const audio = new Audio(audioUrl);
      audio.onerror = () => {
        logger.error('Sample answer audio playback failed');
      };
      await audio.play();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to play sample answer audio', { error: error.message });
    }
  };

  // Handle voice recording (Web Speech API simulation)
  const handleVoiceRecord = () => {
    if (state.isVoiceRecording) return;

    dispatch({ type: 'SET_VOICE_RECORDING', payload: true });
    logger.debug('Starting voice recording');

    // Simulate voice recognition
    setTimeout(() => {
      const mockRecognitionResult = '渋谷に着いて、人が多くて驚きました';
      dispatch({ type: 'SET_VOICE_RESULT', payload: mockRecognitionResult });
      dispatch({ type: 'SET_VOICE_RECORDING', payload: false });

      // Auto-submit after 2 seconds
      setTimeout(() => {
        handleSubmitAnswer(mockRecognitionResult, '音声');
      }, 2000);
    }, 3000);
  };

  // Handle answer submission
  const handleSubmitAnswer = async (answer: string, method: '音声' | 'テキスト') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_USER_ANSWER', payload: answer });

      const feedbackResult = await submitAnswer(answer, method);
      setFeedback(feedbackResult);
      dispatch({ type: 'SET_FEEDBACK', payload: feedbackResult });

      logger.info('Answer submitted successfully', { isCorrect: feedbackResult.is_correct });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to submit answer', { error: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handle next quiz
  const handleNextQuiz = async () => {
    dispatch({ type: 'RESET_STATE' });
    setFeedback(null);
    setManualAnswer('');
    await loadNextQuiz();
  };

  // Handle retry
  const handleRetry = () => {
    dispatch({ type: 'RESET_STATE' });
    setFeedback(null);
    setManualAnswer('');
  };

  // Handle period change
  const handlePeriodChange = async (_event: React.SyntheticEvent, newValue: 'week' | 'month' | 'year') => {
    setSelectedPeriod(newValue);
    try {
      await refreshGraphData(newValue);
      logger.info('Graph data refreshed with new period', { period: newValue });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to refresh graph data on period change', { error: error.message });
    }
  };

  // Render loading state
  if (loading || state.isLoading) {
    return (
      <PublicLayout maxWidth="lg">
        <Box textAlign="center" p={4}>
          <Box
            sx={{
              width: 40,
              height: 40,
              border: '4px solid rgba(122, 156, 94, 0.12)',
              borderTopColor: '#7A9C5E',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Typography variant="body1">読み込み中...</Typography>
        </Box>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout maxWidth="lg">
      <Container maxWidth="lg" sx={{ p: 2 }}>
        {/* Quiz Section */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/stories')}
              variant="outlined"
            >
              ストーリーに戻る
            </Button>
            <Typography variant="h4" component="h1">
              理解度チェック
            </Typography>
          </Box>

          {currentQuiz && (
            <Card elevation={2} sx={{ p: 4, mb: 3 }}>
              {/* Quiz Badge */}
              <Chip
                label={`${currentQuiz.question_type}問題・${currentQuiz.difficulty_level}`}
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />

              {/* Question Text */}
              <Typography variant="h5" component="h2" mb={3}>
                {currentQuiz.question_text}
              </Typography>

              {/* Audio Control */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<VolumeUpIcon />}
                  onClick={handleAudioPlay}
                  disabled={state.isAudioPlaying}
                  sx={{
                    ...(state.isAudioPlaying && {
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.85 },
                      },
                    }),
                  }}
                >
                  {state.isAudioPlaying ? '音声再生中...' : '問題文を聞く'}
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => dispatch({ type: 'TOGGLE_QUESTION_TEXT' })}
                >
                  {state.showQuestionText ? 'テキストを隠す' : 'テキストを表示'}
                </Button>
              </Box>

              {/* Question Text Display */}
              {state.showQuestionText && (
                <Box
                  mt={2}
                  p={2}
                  sx={{
                    bgcolor: 'rgba(122, 156, 94, 0.08)',
                    borderRadius: 1,
                    fontSize: '1rem',
                    lineHeight: 1.8,
                  }}
                >
                  <Typography>{currentQuiz.question_text}</Typography>
                </Box>
              )}

              {/* Answer Methods */}
              <Box mb={4}>
                <Typography variant="subtitle2" mb={2} color="text.secondary">
                  回答方法を選択してください
                </Typography>

                {/* Voice Input */}
                {state.inputMethod === '音声' && (
                  <Box mb={3}>
                    <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<MicIcon />}
                        onClick={handleVoiceRecord}
                        disabled={state.isVoiceRecording}
                        sx={{
                          ...(state.isVoiceRecording && {
                            animation: 'recording 1s ease-in-out infinite',
                            '@keyframes recording': {
                              '0%, 100%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.05)' },
                            },
                          }),
                        }}
                      >
                        {state.isVoiceRecording ? '録音中...' : '音声で回答'}
                      </Button>

                      <Button
                        variant="text"
                        size="small"
                        color="primary"
                        onClick={() => dispatch({ type: 'SWITCH_INPUT_METHOD', payload: 'テキスト' })}
                      >
                        または、手動入力に切り替え
                      </Button>
                    </Box>

                    {/* Voice Recognition Result */}
                    {state.voiceRecognitionResult && (
                      <Box
                        mt={2}
                        p={2}
                        sx={{
                          bgcolor: 'rgba(122, 156, 94, 0.08)',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <strong>認識結果:</strong> {state.voiceRecognitionResult}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Text Input - Choice Buttons */}
                {state.inputMethod === 'テキスト' && (
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      正しいと思う選択肢をクリックしてください
                    </Typography>

                    {/* Choice Buttons */}
                    <Box display="flex" flexDirection="column" gap={2}>
                      {currentQuiz.choices.map((choice, index) => (
                        <Card
                          key={choice.choice_id}
                          sx={{
                            cursor: 'pointer',
                            border: 2,
                            borderColor: manualAnswer === choice.choice_id ? 'primary.main' : 'transparent',
                            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateX(4px)',
                              boxShadow: '0px 2px 8px rgba(122, 156, 94, 0.15)',
                            },
                          }}
                          onClick={() => setManualAnswer(choice.choice_id)}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Chip
                                label={String.fromCharCode(65 + index)}
                                color={manualAnswer === choice.choice_id ? 'primary' : 'default'}
                                size="small"
                              />
                              <Typography variant="body1">
                                {choice.choice_text}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleSubmitAnswer(manualAnswer, 'テキスト')}
                      disabled={!manualAnswer}
                    >
                      回答を送信
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Feedback Card */}
              {state.showFeedback && feedback && (
                <Card
                  elevation={2}
                  sx={{
                    mt: 3,
                    p: 3,
                    border: 2,
                    borderColor: feedback.is_correct ? 'success.main' : 'error.main',
                    bgcolor: feedback.is_correct
                      ? 'rgba(107, 154, 94, 0.04)'
                      : 'rgba(199, 124, 94, 0.04)',
                  }}
                >
                  {/* Feedback Header */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    {feedback.is_correct ? (
                      <CheckCircleIcon sx={{ fontSize: '2rem', color: 'success.main' }} />
                    ) : (
                      <CancelIcon sx={{ fontSize: '2rem', color: 'error.main' }} />
                    )}
                    <Typography
                      variant="h6"
                      component="h3"
                      color={feedback.is_correct ? 'success.main' : 'error.main'}
                      role="status"
                      aria-live="polite"
                    >
                      {feedback.is_correct ? '正解です！' : '惜しい！もう一度確認しましょう'}
                    </Typography>
                  </Box>

                  {/* Explanation */}
                  <Typography variant="body1" mb={2}>
                    {feedback.explanation}
                  </Typography>

                  {/* Sample Answer (for incorrect responses) */}
                  {!feedback.is_correct && feedback.sample_answer && (
                    <Box
                      mt={2}
                      p={2}
                      sx={{
                        bgcolor: 'rgba(122, 156, 94, 0.08)',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" mb={1} color="text.secondary">
                        サンプル回答:
                      </Typography>
                      <Box display="flex" gap={2} alignItems="center">
                        <Typography variant="body1">{feedback.sample_answer}</Typography>
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="サンプル回答を音声で再生"
                          onClick={() => handlePlayAudio(feedback.sample_answer || '')}
                        >
                          <VolumeUpIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box mt={2} display="flex" gap={2}>
                    <Button variant="contained" color="warning" onClick={handleNextQuiz}>
                      次の問題へ
                    </Button>
                    <Button variant="outlined" size="small" onClick={handleRetry}>
                      もう一度試す
                    </Button>
                  </Box>
                </Card>
              )}
            </Card>
          )}
        </Box>

        {/* Progress Section */}
        <Box mt={6} pt={6} sx={{ borderTop: 1, borderColor: 'rgba(122, 156, 94, 0.12)' }}>
          <Typography variant="h5" component="h2" mb={4}>
            学習進捗
          </Typography>

          {/* Stats Summary */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 3,
              mb: 4,
            }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" color="primary" mb={1}>
                  {progress?.accuracy_rate || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  総合正答率
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" color="primary" mb={1}>
                  {progress?.total_quizzes || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  完了問題数
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" color="primary" mb={1}>
                  {progress?.completed_stories.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  完了ストーリー
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Level-Specific Progress Section */}
          {progress && progress.level_progress && (
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 3,
                mb: 4,
                boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <Typography variant="h6" component="h3" mb={3}>
                レベル別進捗
              </Typography>

              {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((level) => {
                const levelData = progress.level_progress[level];
                const progressPercentage =
                  levelData.total > 0 ? (levelData.completed / levelData.total) * 100 : 0;

                return (
                  <Box key={level} mb={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {level}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {levelData.accuracy.toFixed(1)}% ({levelData.completed}/{levelData.total})
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(122, 156, 94, 0.12)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'primary.main',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Progress Chart */}
          {graphData && (
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 3,
                mb: 4,
                boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <Typography variant="h6" component="h3" mb={3}>
                レベル別正答率の推移
              </Typography>

              {/* Period Selection Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  aria-label="期間選択タブ"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                >
                  <Tab label="週" value="week" />
                  <Tab label="月" value="month" />
                  <Tab label="年" value="year" />
                </Tabs>
              </Box>

              <svg viewBox="0 0 800 300" style={{ width: '100%', height: '300px' }}>
                {/* Grid Lines */}
                <line
                  x1="80"
                  y1="50"
                  x2="780"
                  y2="50"
                  stroke="rgba(122, 156, 94, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
                <line
                  x1="80"
                  y1="100"
                  x2="780"
                  y2="100"
                  stroke="rgba(122, 156, 94, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
                <line
                  x1="80"
                  y1="150"
                  x2="780"
                  y2="150"
                  stroke="rgba(122, 156, 94, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
                <line
                  x1="80"
                  y1="200"
                  x2="780"
                  y2="200"
                  stroke="rgba(122, 156, 94, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
                <line
                  x1="80"
                  y1="250"
                  x2="780"
                  y2="250"
                  stroke="rgba(122, 156, 94, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />

                {/* Axes */}
                <line x1="80" y1="250" x2="780" y2="250" stroke="#6B7A64" strokeWidth="2" />
                <line x1="80" y1="50" x2="80" y2="250" stroke="#6B7A64" strokeWidth="2" />

                {/* Y-axis Labels */}
                <text x="50" y="55" fontSize="0.75rem" fill="#6B7A64">
                  100%
                </text>
                <text x="55" y="105" fontSize="0.75rem" fill="#6B7A64">
                  80%
                </text>
                <text x="55" y="155" fontSize="0.75rem" fill="#6B7A64">
                  60%
                </text>
                <text x="55" y="205" fontSize="0.75rem" fill="#6B7A64">
                  40%
                </text>
                <text x="55" y="255" fontSize="0.75rem" fill="#6B7A64">
                  20%
                </text>

                {/* X-axis Labels */}
                <text x="100" y="275" fontSize="0.75rem" fill="#6B7A64">
                  1週間前
                </text>
                <text x="280" y="275" fontSize="0.75rem" fill="#6B7A64">
                  5日前
                </text>
                <text x="460" y="275" fontSize="0.75rem" fill="#6B7A64">
                  3日前
                </text>
                <text x="640" y="275" fontSize="0.75rem" fill="#6B7A64">
                  今日
                </text>

                {/* Bar Chart - 1週間前 */}
                <rect x="105" y="200" width="15" height="50" fill="#7A9C5E" opacity="0.8" />
                <rect x="120" y="220" width="15" height="30" fill="#A67C52" opacity="0.8" />
                <rect x="135" y="230" width="15" height="20" fill="#C9A573" opacity="0.8" />

                {/* Bar Chart - 5日前 */}
                <rect x="285" y="170" width="15" height="80" fill="#7A9C5E" opacity="0.8" />
                <rect x="300" y="200" width="15" height="50" fill="#A67C52" opacity="0.8" />
                <rect x="315" y="215" width="15" height="35" fill="#C9A573" opacity="0.8" />

                {/* Bar Chart - 3日前 */}
                <rect x="465" y="140" width="15" height="110" fill="#7A9C5E" opacity="0.8" />
                <rect x="480" y="180" width="15" height="70" fill="#A67C52" opacity="0.8" />
                <rect x="495" y="200" width="15" height="50" fill="#C9A573" opacity="0.8" />

                {/* Bar Chart - 今日 */}
                <rect x="645" y="90" width="15" height="160" fill="#7A9C5E" opacity="0.8" />
                <rect x="660" y="150" width="15" height="100" fill="#A67C52" opacity="0.8" />
                <rect x="675" y="170" width="15" height="80" fill="#C9A573" opacity="0.8" />
              </svg>

              {/* Chart Legend */}
              <Box display="flex" gap={2} justifyContent="center" mt={2} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#7A9C5E', borderRadius: 0.5 }} />
                  <Typography variant="body2">N5 / A1</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#A67C52', borderRadius: 0.5 }} />
                  <Typography variant="body2">N4 / A2</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#C9A573', borderRadius: 0.5 }} />
                  <Typography variant="body2">N3 / B1</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Learning History */}
          <Box mb={4}>
            <Typography variant="h6" component="h3" mb={3}>
              学習履歴
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
              }}
            >
              {completionHistory.map((story) => (
                <Card key={story.story_id}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {story.story_title}
                      </Typography>
                      <Chip label="完了" color="success" size="small" />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {new Date(story.completed_at).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon sx={{ fontSize: '0.875rem', color: 'primary.main' }} />
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        正答率: {story.accuracy_rate}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Recommendations */}
          {recommendedStory && (
            <Box mt={4} pt={4} sx={{ borderTop: 1, borderColor: 'rgba(122, 156, 94, 0.12)' }}>
              <Typography variant="h6" component="h3" mb={3}>
                次のおすすめストーリー
              </Typography>

              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 4px 8px rgba(122, 156, 94, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Chip label="おすすめ" color="warning" size="small" sx={{ mb: 1 }} />
                  <Typography variant="h6" component="h4" mb={1}>
                    {recommendedStory.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recommendedStory.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Container>
    </PublicLayout>
  );
};

export default QuizProgressPage;
