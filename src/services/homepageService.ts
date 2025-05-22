import { Video } from '../types';
import { getVideosByCategory } from './videoService';

// Get featured items for homepage by category
export const getFeaturedContentByCategory = async (categoryId: string) => {
  // Get featured videos
  const videos = getVideosByCategory(categoryId);
  const featuredVideos = videos.filter(video => video.featured);

  return {
    videos: featuredVideos
  };
};
