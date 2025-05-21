import { Video } from '../types';
import { videoService, toggleVideoFeatured, getVideosByCategory } from './videoService';

// Get featured videos for a specific category from the videos service
export const getFeaturedVideosForCategory = (categoryId: string) => {
  const videos = getVideosByCategory(categoryId);
  return videos.filter(video => video.featured);
};

// Add a method to get featured videos formatted for the 360 Tours display
export const get360TourItems = () => {
  const videos = getVideosByCategory('360');
  
  return videos.map((video, index) => ({
    id: video.id,
    title: `360° Tour ${index + 1}`,
    description: `Immersive 360° virtual experience ${index + 1} allowing viewers to explore environments interactively.`,
    youtubeUrl: video.youtubeUrl,
    thumbnail: video.thumbnail,
    featured: video.featured,
    order: video.order,
    isDisplayed: true
  }));
};

// Get videos for a specific category from the videos service, preserving exact order
export const getCategoryVideos = (categoryId: string) => {
  return getVideosByCategory(categoryId);
};

// Add a method to get videos formatted for display on category pages
export const getCategoryPageVideos = (categoryId: string) => {
  const videos = getVideosByCategory(categoryId);
  
  // Preserves exact ordering from the admin panel
  return videos.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description,
    youtubeUrl: video.youtubeUrl,
    thumbnail: video.thumbnail,
    featured: video.featured,
    order: video.order,
    isDisplayed: true,
    isVideo: true
  }));
};
