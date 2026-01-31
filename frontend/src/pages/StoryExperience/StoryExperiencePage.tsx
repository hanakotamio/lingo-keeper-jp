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
  Avatar,
  Badge,
  ButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  VolumeUp as VolumeUpIcon,
  Check as CheckIcon,
  Book as BookIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useStoryData } from '@/hooks/useStoryData';
import { useStoryViewer } from '@/hooks/useStoryViewer';
import { StoryApiService } from '@/services/api/StoryApiService';
import { StoryCompletionModal } from '@/components/StoryCompletionModal';
import type { LevelFilter, Chapter, Story, StoryCompletion } from '@/types';
import { logger } from '@/lib/logger';
import {
  isStoryCompleted,
  saveStoryCompletion,
  calculateStoryQuizAccuracy,
  getLanguagePreference,
  saveLanguagePreference,
} from '@/lib/storage';
import { getRecommendedStory, getRecommendedStories } from '@/lib/recommendation';

/**
 * Story Experience Page
 *
 * This page provides:
 * - Level-filtered story list (N5/A1 to N1/C2)
 * - Story content display with ruby and translation options
 * - Branching choice selection (card-based UI)
 * - Progress bar
 * - Text-to-speech functionality
 * - Quick access to comprehension check
 *
 * Layout: PublicLayout (no authentication required)
 */
export const StoryExperiencePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedStoryData, setCompletedStoryData] = useState<{
    story: Story;
    quizAccuracy: number;
  } | null>(null);
  const [recommendedStories, setRecommendedStories] = useState<Story[]>([]);
  const [nextRecommendedStory, setNextRecommendedStory] = useState<Story | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0); // 0.75, 1.0, or 1.25

  const { stories, loading: storiesLoading } = useStoryData(selectedLevel);
  const {
    state: viewerState,
    selectStory,
    loadChapter,
    selectChoice,
    updateProgress,
    toggleRuby,
    toggleTranslation,
    setAudioPlaying,
    setLoading,
    resetState,
  } = useStoryViewer();

  // Set default language to English for English-speaking users
  useEffect(() => {
    const languagePreference = getLanguagePreference();
    if (!languagePreference) {
      saveLanguagePreference('en');
    }
  }, []);

  // Load recommended stories when stories are loaded
  useEffect(() => {
    if (stories.length > 0) {
      const recommended = getRecommendedStories(stories, 3);
      setRecommendedStories(recommended);
    }
  }, [stories]);

  // Handle quiz completion - show completion modal
  useEffect(() => {
    const quizCompleted = searchParams.get('quizCompleted');
    const completedStoryId = searchParams.get('storyId');

    if (quizCompleted === 'true' && completedStoryId && stories.length > 0) {
      const story = stories.find(s => s.story_id === completedStoryId);

      if (story) {
        // Calculate quiz accuracy from LocalStorage
        const quizAccuracy = calculateStoryQuizAccuracy(completedStoryId);

        // Save completion data
        const completion: StoryCompletion = {
          story_id: story.story_id,
          completed_at: new Date().toISOString(),
          completion_percentage: 100,
          quiz_accuracy: quizAccuracy,
          chapters_completed: viewerState.completedChapters,
        };
        saveStoryCompletion(completion);

        // Get recommended story for next reading
        const recommended = getRecommendedStory(stories);
        setNextRecommendedStory(recommended);

        // Show completion modal
        setCompletedStoryData({
          story,
          quizAccuracy,
        });
        setShowCompletionModal(true);

        // Clear URL parameters
        setSearchParams({});

        logger.info('Story and quiz completed', {
          storyId: story.story_id,
          quizAccuracy,
        });
      }
    }
  }, [searchParams, stories, viewerState.completedChapters, setSearchParams]);

  // Load chapter when currentChapterId changes
  useEffect(() => {
    console.log('[DEBUG] useEffect triggered', { currentChapterId: viewerState.currentChapterId });
    if (viewerState.currentChapterId) {
      const fetchChapter = async () => {
        try {
          console.log('[DEBUG] Fetching chapter', { chapterId: viewerState.currentChapterId });
          setLoading(true);
          const chapter = await StoryApiService.getChapterById(viewerState.currentChapterId!);
          console.log('[DEBUG] Chapter fetched successfully', { chapter });
          setCurrentChapter(chapter);
          setLoading(false);

          // Check if this is the final chapter (chapter_number === 5 and no choices)
          if (chapter.chapter_number === 5 && (!chapter.choices || chapter.choices.length === 0)) {
            // Story completed! Navigate to quiz page
            if (viewerState.currentStoryId && !isStoryCompleted(viewerState.currentStoryId)) {
              logger.info('Story completed, navigating to quiz', {
                storyId: viewerState.currentStoryId,
              });

              // Navigate to quiz page with parameters
              navigate(
                `/quiz?story=${viewerState.currentStoryId}&returnTo=/story-experience&fromCompletion=true`
              );
            }
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          logger.error('Failed to load chapter', { error: error.message });
          setLoading(false);
        }
      };

      fetchChapter();
    }
  }, [viewerState.currentChapterId, viewerState.currentStoryId, navigate]);

  // Handle story card click
  const handleStoryClick = async (storyId: string) => {
    try {
      console.log('[DEBUG] Story card clicked', { storyId });
      logger.info('Story card clicked', { storyId });

      setLoading(true);

      // Load story
      const story = await StoryApiService.getStoryById(storyId);
      console.log('[DEBUG] Story loaded', { story, root_chapter_id: story.root_chapter_id });

      // Load first chapter
      const firstChapter = await StoryApiService.getChapterById(story.root_chapter_id);
      console.log('[DEBUG] First chapter loaded', { firstChapter });

      // Update state
      setCurrentStory(story);
      setCurrentChapter(firstChapter);
      selectStory(storyId);
      loadChapter(story.root_chapter_id);
      console.log('[DEBUG] Story and chapter loaded');

      setShowStoryViewer(true);
      console.log('[DEBUG] Story viewer shown');
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[DEBUG] Failed to load story', error);
      logger.error('Failed to load story', { error: error.message, storyId });
      setLoading(false);
    }
  };

  // Handle back to list
  const handleBackToList = () => {
    setShowStoryViewer(false);
    resetState();
    setCurrentChapter(null);
    setCurrentStory(null);
  };

  // Handle choice selection
  const handleChoiceClick = (choiceId: string, nextChapterId: string) => {
    selectChoice(choiceId, nextChapterId);

    // Calculate new progress
    const newProgress = Math.min(100, viewerState.progress + 20);
    updateProgress(newProgress);
  };

  // Handle audio playback using Google Cloud TTS API (backend)
  const handleAudioPlay = async () => {
    if (!currentChapter) return;

    try {
      setAudioPlaying(true);
      logger.info('Starting audio playback with Google Cloud TTS', { speechSpeed });

      // Call backend TTS API with speech speed
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentChapter.content,
          speakingRate: speechSpeed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const data = await response.json();

      if (!data.success || !data.data?.audioUrl) {
        throw new Error('Invalid TTS response');
      }

      // Create audio element and play
      const audio = new Audio(data.data.audioUrl);

      audio.onended = () => {
        setAudioPlaying(false);
        logger.info('Audio playback completed');
      };

      audio.onerror = (err) => {
        logger.error('Audio playback error', { error: String(err) });
        setAudioPlaying(false);
      };

      await audio.play();
      logger.info('Audio playback started (Google Cloud TTS)');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to play audio', { error: error.message });
      setAudioPlaying(false);
      alert('音声の再生に失敗しました。もう一度お試しください。');
    }
  };

  // Handle go to quiz
  const handleGoToQuiz = () => {
    // Navigate to quiz page with story ID
    if (viewerState.currentStoryId) {
      navigate(`/quiz?story=${viewerState.currentStoryId}`);
    } else {
      navigate('/quiz');
    }
  };

  // Handle completion modal close
  const handleCompletionModalClose = () => {
    setShowCompletionModal(false);
  };

  // Handle go to recommended story from completion modal
  const handleGoToRecommendedStory = async (storyId: string) => {
    try {
      setShowCompletionModal(false);
      setLoading(true);

      // Load the new story
      const story = await StoryApiService.getStoryById(storyId);

      // Reset progress for the new story
      resetState();
      setCurrentChapter(null);
      setCurrentStory(story);

      // Select the new story and load its first chapter
      selectStory(storyId);
      loadChapter(story.root_chapter_id);

      // Keep story viewer open
      setShowStoryViewer(true);
      setLoading(false);

      logger.info('Jumped to recommended story', { storyId });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to jump to recommended story', { error: error.message, storyId });
      setLoading(false);
    }
  };

  // Handle back to list from completion modal
  const handleBackToListFromModal = () => {
    setShowCompletionModal(false);
    handleBackToList();
  };

  // Render loading state
  if (viewerState.isLoading || storiesLoading) {
    return (
      <PublicLayout maxWidth="lg">
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
          <Typography variant="body1">読み込み中...</Typography>
        </Box>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout maxWidth="lg">
      <Container maxWidth="lg" sx={{ p: 2 }}>
        {/* Story List Section */}
        {!showStoryViewer && (
          <Box>
            {/* Level Selection */}
            <Box
              mb={4}
              p={3}
              sx={{
                bgcolor: 'primary.main',
                borderRadius: 1,
                boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h4" component="h1" color="white" mb={2}>
                レベル別ストーリー一覧
              </Typography>

              <Box display="flex" gap={1} flexWrap="wrap">
                {(['all', 'N5-A1', 'N4-A2', 'N3-B1', 'N2-B2', 'N1-C1'] as LevelFilter[]).map((level) => (
                  <Button
                    key={level}
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    onClick={() => setSelectedLevel(level)}
                    sx={{
                      bgcolor: selectedLevel === level ? 'warning.main' : 'rgba(255, 255, 255, 0.1)',
                      borderColor: selectedLevel === level ? 'warning.main' : 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    {level === 'all' ? 'すべて' : level.replace('-', ' / ')}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Recommended Stories Section */}
            {recommendedStories.length > 0 && (
              <Box mb={4}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <StarIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                  <Typography variant="h5" component="h2">
                    あなたにおすすめ
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 3,
                  }}
                >
                  {recommendedStories.map((story) => {
                    const completed = isStoryCompleted(story.story_id);

                    return (
                      <Box
                        key={story.story_id}
                        data-testid="recommended-story-card"
                        onClick={() => handleStoryClick(story.story_id)}
                        sx={{ cursor: 'pointer', position: 'relative' }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            width: '100%',
                            border: '2px solid',
                            borderColor: 'warning.light',
                            bgcolor: 'rgba(201, 165, 115, 0.05)',
                            '&:hover': {
                              borderColor: 'warning.main',
                              transform: 'translateY(-4px)',
                              boxShadow: '0px 4px 8px rgba(201, 165, 115, 0.25)',
                            },
                          }}
                        >
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Chip
                                label={`${story.level_jlpt} / ${story.level_cefr}`}
                                color="warning"
                                size="small"
                              />
                              {completed && (
                                <Chip
                                  label="完了"
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleIcon />}
                                />
                              )}
                            </Box>

                            <Typography variant="h6" component="h3" mb={1}>
                              {story.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={2}>
                              {story.description}
                            </Typography>

                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mt={2}
                              pt={2}
                              borderTop={1}
                              borderColor="divider"
                            >
                              <Typography variant="body2">約{story.estimated_time}分</Typography>
                              {completed ? (
                                <Typography variant="body2" color="success.main" fontWeight="medium">
                                  完了済み ✓
                                </Typography>
                              ) : (
                                <Chip
                                  label="おすすめ"
                                  color="warning"
                                  size="small"
                                  icon={<StarIcon />}
                                />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Story List */}
            <Box mb={4}>
              <Typography variant="h5" component="h2" mb={3}>
                すべてのストーリー
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 3,
                }}
              >
                {stories.map((story) => {
                  const completed = isStoryCompleted(story.story_id);

                  return (
                    <Box
                      key={story.story_id}
                      data-testid="story-card"
                      onClick={() => handleStoryClick(story.story_id)}
                      sx={{ cursor: 'pointer', position: 'relative' }}
                    >
                      <Badge
                        badgeContent={
                          completed ? (
                            <CheckCircleIcon
                              sx={{
                                fontSize: 32,
                                color: 'success.main',
                                bgcolor: 'white',
                                borderRadius: '50%',
                              }}
                            />
                          ) : null
                        }
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        sx={{
                          width: '100%',
                          '& .MuiBadge-badge': {
                            top: 12,
                            right: 12,
                          },
                        }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            width: '100%',
                            opacity: completed ? 0.85 : 1,
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateY(-4px)',
                              boxShadow: '0px 4px 8px rgba(122, 156, 94, 0.15)',
                              opacity: 1,
                            },
                          }}
                        >
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Chip
                                data-testid="story-level"
                                label={`${story.level_jlpt} / ${story.level_cefr}`}
                                color="primary"
                                size="small"
                              />
                              {completed && (
                                <Chip
                                  label="完了"
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleIcon />}
                                />
                              )}
                            </Box>

                            <Typography variant="h6" component="h3" mb={1} data-testid="story-title">
                              {story.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={2} data-testid="story-description">
                              {story.description}
                            </Typography>

                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mt={2}
                              pt={2}
                              borderTop={1}
                              borderColor="divider"
                            >
                              <Typography variant="body2" data-testid="story-time">
                                約{story.estimated_time}分
                              </Typography>
                              {completed ? (
                                <Typography variant="body2" color="success.main" fontWeight="medium">
                                  完了済み ✓
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="primary" fontWeight="medium">
                                  進捗: 0%
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Badge>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}

        {/* Story Viewer Section */}
        {showStoryViewer && currentChapter && (
          <Box>
            {/* Story Header */}
            <Box mb={4}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToList}
                sx={{ mb: 2 }}
              >
                ストーリー一覧に戻る
              </Button>

              <Chip
                data-testid="story-level"
                icon={<BookIcon />}
                label={`${currentStory?.level_jlpt} / ${currentStory?.level_cefr}`}
                color="primary"
                sx={{ mb: 2, display: 'flex', width: 'fit-content' }}
              />

              <Typography variant="h4" component="h1" mb={3}>
                {currentStory?.title}
              </Typography>

              {/* Progress Container */}
              <Box my={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    チャプター {currentChapter.chapter_number}/5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewerState.progress}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={viewerState.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>

            {/* Content Options */}
            <Box display="flex" gap={2} mb={2}>
              <Button
                variant={viewerState.showRuby ? 'contained' : 'outlined'}
                size="small"
                onClick={toggleRuby}
              >
                ルビ表示
              </Button>
              <Button
                variant={viewerState.showTranslation ? 'contained' : 'outlined'}
                size="small"
                onClick={toggleTranslation}
              >
                翻訳表示
              </Button>
            </Box>

            {/* Content Box */}
            <Box
              p={4}
              my={3}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: '0px 2px 4px rgba(0,0,0,0.06)',
                lineHeight: 2,
              }}
            >
              <Typography
                data-testid="chapter-content"
                variant="body1"
                component="div"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 2.2,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {currentChapter.content}
              </Typography>
            </Box>

            {/* Audio Control */}
            <Box my={3}>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<VolumeUpIcon />}
                  onClick={handleAudioPlay}
                  disabled={viewerState.isAudioPlaying}
                  sx={{
                    ...(viewerState.isAudioPlaying && {
                      bgcolor: 'secondary.main',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.85 },
                      },
                    }),
                  }}
                >
                  {viewerState.isAudioPlaying ? '音声再生中...' : '音声を聞く'}
                </Button>

                {/* Speech Speed Selector */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Speech speed">
                    <SpeedIcon sx={{ color: 'text.secondary' }} />
                  </Tooltip>
                  <ButtonGroup size="small" variant="outlined">
                    <Button
                      onClick={() => setSpeechSpeed(0.75)}
                      variant={speechSpeed === 0.75 ? 'contained' : 'outlined'}
                      sx={{ minWidth: '60px' }}
                    >
                      Slow
                    </Button>
                    <Button
                      onClick={() => setSpeechSpeed(1.0)}
                      variant={speechSpeed === 1.0 ? 'contained' : 'outlined'}
                      sx={{ minWidth: '70px' }}
                    >
                      Normal
                    </Button>
                    <Button
                      onClick={() => setSpeechSpeed(1.25)}
                      variant={speechSpeed === 1.25 ? 'contained' : 'outlined'}
                      sx={{ minWidth: '60px' }}
                    >
                      Fast
                    </Button>
                  </ButtonGroup>
                </Box>
              </Box>
            </Box>

            {/* 語彙ヘルプ */}
            {currentChapter.vocabulary && currentChapter.vocabulary.length > 0 && (
              <Box
                my={3}
                p={3}
                sx={{
                  bgcolor: 'rgba(122, 156, 94, 0.05)',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'rgba(122, 156, 94, 0.2)',
                }}
              >
                <Typography variant="h6" component="h3" mb={2} color="primary">
                  💡 語彙ヘルプ
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  このチャプターで使われている重要な単語と表現の説明です。
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {(currentChapter.vocabulary?.words || []).map((item: any, index: number) => {
                    // Vocabulary structure: { word, reading, meaning }
                    const meaning = item.meaning || '';

                    return (
                      <Card key={index} sx={{ bgcolor: 'background.paper' }}>
                        <CardContent>
                          <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" alignItems="baseline" gap={1}>
                              <Typography variant="h6" component="span" color="primary">
                                {item.word}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ({item.reading})
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                              {meaning}
                            </Typography>
                            {item.example && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                例：{item.example}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Choices Section */}
            {currentChapter.choices && currentChapter.choices.length > 0 && (
              <Box mt={5}>
                <Typography variant="h6" component="h3" mb={3}>
                  次はどうしますか？
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 3,
                  }}
                >
                  {currentChapter.choices.map((choice, index) => (
                    <Card
                      key={choice.choice_id}
                      onClick={() => handleChoiceClick(choice.choice_id, choice.next_chapter_id || '')}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        border: 2,
                        borderColor:
                          viewerState.selectedChoiceId === choice.choice_id
                            ? 'warning.main'
                            : 'rgba(122, 156, 94, 0.12)',
                        bgcolor:
                          viewerState.selectedChoiceId === choice.choice_id
                            ? 'rgba(201, 165, 115, 0.12)'
                            : 'background.paper',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: '0px 4px 8px rgba(122, 156, 94, 0.2)',
                          bgcolor: 'rgba(122, 156, 94, 0.04)',
                        },
                      }}
                    >
                      <CardContent>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                            mb: 2,
                          }}
                        >
                          {index + 1}
                        </Avatar>

                        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                          {choice.choice_text}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* Quick Actions */}
            <Box mt={4} pt={4} borderTop={1} borderColor="divider" display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="warning"
                startIcon={<CheckIcon />}
                onClick={handleGoToQuiz}
              >
                理解度チェックへ
              </Button>
            </Box>
          </Box>
        )}

        {/* Story Completion Modal */}
        {completedStoryData && (
          <StoryCompletionModal
            open={showCompletionModal}
            onClose={handleCompletionModalClose}
            story={completedStoryData.story}
            quizAccuracy={completedStoryData.quizAccuracy}
            onGoToRecommended={handleGoToRecommendedStory}
            onBackToList={handleBackToListFromModal}
            recommendedStory={nextRecommendedStory}
          />
        )}
      </Container>
    </PublicLayout>
  );
};

export default StoryExperiencePage;
