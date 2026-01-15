import React from 'react';
import { StoryExperiencePage } from './StoryExperience/StoryExperiencePage';

/**
 * StoriesPage - Public Story List and Viewer
 *
 * This page wraps StoryExperiencePage to provide story browsing
 * without authentication (guest access).
 *
 * Route: /stories (public)
 */
export const StoriesPage: React.FC = () => {
  return <StoryExperiencePage />;
};
