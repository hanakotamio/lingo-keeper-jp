import { useReducer, useCallback } from 'react';
import type { StoryViewerState, StoryAction } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Initial state for story viewer
 */
const initialState: StoryViewerState = {
  currentStoryId: null,
  currentChapterId: null,
  selectedChoiceId: null,
  progress: 0,
  showRuby: false, // Learners can enable ruby/translation when needed
  showTranslation: false,
  completedChapters: [],
  isAudioPlaying: false,
  isLoading: false,
};

/**
 * Reducer for story viewer state management
 */
const storyViewerReducer = (
  state: StoryViewerState,
  action: StoryAction
): StoryViewerState => {
  logger.debug('Story viewer action', {
    type: action.type,
    currentState: state
  });

  switch (action.type) {
    case 'SELECT_STORY':
      return {
        ...state,
        currentStoryId: action.payload.storyId,
        currentChapterId: null,
        selectedChoiceId: null,
        progress: 0,
        completedChapters: [],
      };

    case 'LOAD_CHAPTER':
      return {
        ...state,
        currentChapterId: action.payload.chapterId,
        selectedChoiceId: null,
      };

    case 'SELECT_CHOICE':
      return {
        ...state,
        selectedChoiceId: action.payload.choiceId,
        completedChapters: state.currentChapterId
          ? [...state.completedChapters, state.currentChapterId]
          : state.completedChapters,
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: Math.min(100, Math.max(0, action.payload.progress)),
      };

    case 'TOGGLE_RUBY':
      return {
        ...state,
        showRuby: !state.showRuby,
      };

    case 'TOGGLE_TRANSLATION':
      return {
        ...state,
        showTranslation: !state.showTranslation,
      };

    case 'SET_AUDIO_PLAYING':
      return {
        ...state,
        isAudioPlaying: action.payload.isPlaying,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};

/**
 * Custom hook for story viewer state management
 * Uses React.useReducer for complex state logic
 */
export const useStoryViewer = () => {
  const [state, dispatch] = useReducer(storyViewerReducer, initialState);

  // Action creators
  const selectStory = useCallback((storyId: string) => {
    logger.info('Story selected', { storyId });
    dispatch({ type: 'SELECT_STORY', payload: { storyId } });
  }, []);

  const loadChapter = useCallback((chapterId: string) => {
    logger.info('Chapter loaded', { chapterId });
    dispatch({ type: 'LOAD_CHAPTER', payload: { chapterId } });
  }, []);

  const selectChoice = useCallback((choiceId: string, nextChapterId: string) => {
    logger.info('Choice selected', { choiceId, nextChapterId });
    dispatch({ type: 'SELECT_CHOICE', payload: { choiceId, nextChapterId } });
    // Auto-load next chapter
    setTimeout(() => {
      dispatch({ type: 'LOAD_CHAPTER', payload: { chapterId: nextChapterId } });
    }, 300);
  }, []);

  const updateProgress = useCallback((progress: number) => {
    logger.debug('Progress updated', { progress });
    dispatch({ type: 'UPDATE_PROGRESS', payload: { progress } });
  }, []);

  const toggleRuby = useCallback(() => {
    logger.debug('Ruby toggled');
    dispatch({ type: 'TOGGLE_RUBY' });
  }, []);

  const toggleTranslation = useCallback(() => {
    logger.debug('Translation toggled');
    dispatch({ type: 'TOGGLE_TRANSLATION' });
  }, []);

  const setAudioPlaying = useCallback((isPlaying: boolean) => {
    logger.debug('Audio playing state changed', { isPlaying });
    dispatch({ type: 'SET_AUDIO_PLAYING', payload: { isPlaying } });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    logger.debug('Loading state changed', { isLoading });
    dispatch({ type: 'SET_LOADING', payload: { isLoading } });
  }, []);

  const resetState = useCallback(() => {
    logger.info('Story viewer state reset');
    dispatch({ type: 'RESET_STATE' });
  }, []);

  return {
    state,
    selectStory,
    loadChapter,
    selectChoice,
    updateProgress,
    toggleRuby,
    toggleTranslation,
    setAudioPlaying,
    setLoading,
    resetState,
  };
};
