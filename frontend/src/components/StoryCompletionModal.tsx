import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import type { Story } from '@/types';

interface StoryCompletionModalProps {
  open: boolean;
  onClose: () => void;
  story: Story;
  quizAccuracy: number;
  onGoToRecommended: (storyId: string) => void;
  onBackToList: () => void;
  recommendedStory: Story | null;
}

/**
 * Story Completion Modal Component
 *
 * Displayed when user completes a story (reaches Chapter 5)
 * Shows:
 * - Achievement badge
 * - Quiz accuracy rate
 * - Recommended next story based on learner level
 * - Action buttons (next story, back to list)
 */
export const StoryCompletionModal: React.FC<StoryCompletionModalProps> = ({
  open,
  onClose,
  story,
  quizAccuracy,
  onGoToRecommended,
  onBackToList,
  recommendedStory,
}) => {
  // Message and badge color based on accuracy
  const getAccuracyMessage = (accuracy: number): { message: string; color: string } => {
    if (accuracy >= 90) {
      return {
        message: 'Excellent! Perfect understanding!',
        color: '#FFD700', // Gold
      };
    } else if (accuracy >= 70) {
      return {
        message: 'Well done!',
        color: '#C0C0C0', // Silver
      };
    } else if (accuracy >= 50) {
      return {
        message: 'Good effort!',
        color: '#CD7F32', // Bronze
      };
    } else {
      return {
        message: "Let's review!",
        color: '#7A9C5E', // Theme green
      };
    }
  };

  const { message, color } = getAccuracyMessage(quizAccuracy);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(135deg, #7A9C5E 0%, #C9A573 100%)',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Achievement Badge */}
        <Box textAlign="center" mb={3}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: color,
              boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
              animation: 'bounce 1s ease-in-out',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              },
            }}
          >
            <TrophyIcon sx={{ fontSize: 80, color: 'white' }} />
          </Box>

          <Typography variant="h4" component="h2" color="white" mt={2} mb={1}>
            Story Completed!
          </Typography>

          <Chip
            icon={<CheckCircleIcon />}
            label={`${story.level_jlpt} / ${story.level_cefr}`}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          />
        </Box>

        {/* Story Title */}
        <Card sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
          <CardContent>
            <Typography variant="h6" component="h3" mb={1} textAlign="center">
              {story.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {story.description}
            </Typography>
          </CardContent>
        </Card>

        {/* Quiz Accuracy */}
        <Card sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body1" fontWeight="medium">
                Quiz Accuracy
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {quizAccuracy}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={quizAccuracy}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(122, 156, 94, 0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                },
              }}
            />

            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
              {message}
            </Typography>
          </CardContent>
        </Card>

        {/* Recommended Next Story */}
        {recommendedStory && (
          <Card sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="medium" mb={2} color="primary">
                Recommended Next Story
              </Typography>

              <Box
                p={2}
                sx={{
                  bgcolor: 'rgba(122, 156, 94, 0.08)',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'rgba(122, 156, 94, 0.3)',
                }}
              >
                <Chip
                  label={`${recommendedStory.level_jlpt} / ${recommendedStory.level_cefr}`}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />

                <Typography variant="body1" fontWeight="medium" mb={1}>
                  {recommendedStory.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {recommendedStory.description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box display="flex" flexDirection="column" gap={2}>
          {recommendedStory && (
            <Button
              variant="contained"
              color="warning"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => onGoToRecommended(recommendedStory.story_id)}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              Go to Next Story
            </Button>
          )}

          <Button
            variant="outlined"
            size="large"
            onClick={onBackToList}
            sx={{
              py: 1.5,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.9)',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'white',
                borderColor: 'white',
              },
            }}
          >
            Back to Story List
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StoryCompletionModal;
