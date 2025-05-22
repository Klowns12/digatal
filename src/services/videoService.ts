import { Video } from '../types';
import { toggleItemFeatured } from './homepageService';

// Initial sample videos
const initialVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to SCORM',
    titleThai: 'แนะนำ SCORM',
    description: 'Learn about SCORM packages and how they work',
    descriptionThai: 'เรียนรู้เกี่ยวกับแพ็คเกจ SCORM และการทำงาน',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    categoryId: 'elearning',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    order: 1
  },
  {
    id: '2',
    title: 'Video Production Basics',
    titleThai: 'พื้นฐานการผลิตวิดีโอ',
    description: 'Basic techniques for educational video production',
    descriptionThai: 'เทคนิคพื้นฐานสำหรับการผลิตวิดีโอเพื่อการศึกษา',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    categoryId: 'video',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    order: 1
  }
];

// Local storage key
const STORAGE_KEY = 'admin_videos';

// Extract YouTube video ID from URL
export const getYoutubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

// Generate thumbnail URL from YouTube URL
export const generateThumbnail = (url: string): string => {
  const videoId = getYoutubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
};

// Load videos from storage or use defaults
const loadVideos = (): Video[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialVideos;
};

// Save videos to storage
const saveVideos = (videos: Video[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('videos-updated'));
};

// Get all videos
export const getVideos = (): Video[] => {
  return loadVideos();
};

// Get max order number for a category
export const getMaxOrderForCategory = (categoryId: string): number => {
  const videos = loadVideos();
  const categoryVideos = videos.filter(video => video.categoryId === categoryId);
  
  if (categoryVideos.length === 0) {
    return 0;
  }
  
  return Math.max(...categoryVideos.map(video => video.order));
};

// Get videos by category with preserved order and featured status
export const getVideosByCategory = (categoryId: string): Video[] => {
  return loadVideos()
    .filter(video => video.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
};

// Get featured videos in a category (for home page)
export const getFeaturedInCategoryVideos = (categoryId: string): Video[] => {
  const videos = loadVideos();
  // กรองเฉพาะวิดีโอที่ featured=true และอยู่ในหมวดหมู่ที่ต้องการ
  return videos.filter(video => 
    video.categoryId === categoryId && 
    video.featured === true
  ).sort((a, b) => a.order - b.order);
};

// Get a specific video
export const getVideo = (id: string): Video | undefined => {
  return loadVideos().find(video => video.id === id);
};

// Add a new video with optional featured status and order
export const addVideo = (video: Omit<Video, 'id' | 'thumbnail'>): Video => {
  const videos = loadVideos();
  
  // If order is not specified or is 0, set it to be the last
  let newOrder = video.order || 0;
  if (newOrder <= 0) {
    newOrder = getMaxOrderForCategory(video.categoryId) + 1;
  } else {
    // If order is specified, shift other videos down
    const videosToShift = videos.filter(
      v => v.categoryId === video.categoryId && v.order >= newOrder
    );
    
    // Update orders of existing videos
    for (const v of videosToShift) {
      v.order += 1;
    }
  }
  
  const newVideo: Video = {
    ...video,
    id: `video-${Date.now()}`,
    thumbnail: generateThumbnail(video.youtubeUrl),
    featured: video.featured || false,
    order: newOrder
  };
  
  saveVideos([...videos, newVideo]);
  
  // Ensure order is preserved and updates propagate immediately to category page
  window.dispatchEvent(new CustomEvent('video-order-changed'));
  
  return newVideo;
};

// Update a video
export const updateVideo = (id: string, updates: Partial<Video>): Video | null => {
  const videos = loadVideos();
  let updatedVideo: Video | null = null;
  
  // Handle order changes
  if (updates.order && updates.order > 0) {
    const oldVideo = videos.find(v => v.id === id);
    if (oldVideo) {
      // If the category is changing, treat order independently in each category
      const relevantCategoryId = updates.categoryId || oldVideo.categoryId;
      const oldOrder = oldVideo.order;
      const newOrder = updates.order;
      
      if (oldOrder !== newOrder) {
        // Shift videos in between the old and new order
        videos.forEach(v => {
          if (v.id !== id && v.categoryId === relevantCategoryId) {
            if (oldOrder < newOrder && v.order > oldOrder && v.order <= newOrder) {
              // Moving down - shift videos in between up
              v.order -= 1;
            } else if (oldOrder > newOrder && v.order < oldOrder && v.order >= newOrder) {
              // Moving up - shift videos in between down
              v.order += 1;
            }
          }
        });
      }
    }
  }
  
  const updatedVideos = videos.map(video => {
    if (video.id === id) {
      updatedVideo = { 
        ...video, 
        ...updates,
        // Always regenerate thumbnail when URL changes
        thumbnail: updates.youtubeUrl ? generateThumbnail(updates.youtubeUrl) : video.thumbnail
      };
      return updatedVideo;
    }
    return video;
  });
  
  if (updatedVideo) {
    saveVideos(updatedVideos);
    
    // Dispatch dedicated event when video order changes
    if (updates.order) {
      window.dispatchEvent(new CustomEvent('video-order-changed'));
    }
    
    return updatedVideo;
  }
  
  return null;
};

// Move video up in order (decrease order number)
export const moveVideoUp = (id: string): boolean => {
  const videos = loadVideos();
  const videoIndex = videos.findIndex(v => v.id === id);
  
  if (videoIndex === -1) return false;
  
  const video = videos[videoIndex];
  const categoryVideos = videos.filter(v => v.categoryId === video.categoryId);
  categoryVideos.sort((a, b) => a.order - b.order);
  
  const videoOrderIndex = categoryVideos.findIndex(v => v.id === id);
  
  // Already at the top
  if (videoOrderIndex === 0) return false;
  
  const videoAbove = categoryVideos[videoOrderIndex - 1];
  
  // Swap orders
  const tempOrder = video.order;
  video.order = videoAbove.order;
  videoAbove.order = tempOrder;
  
  saveVideos(videos);
  
  // Dispatch specific event for order changes
  window.dispatchEvent(new CustomEvent('video-order-changed'));
  
  return true;
};

// Move video down in order (increase order number)
export const moveVideoDown = (id: string): boolean => {
  const videos = loadVideos();
  const videoIndex = videos.findIndex(v => v.id === id);
  
  if (videoIndex === -1) return false;
  
  const video = videos[videoIndex];
  const categoryVideos = videos.filter(v => v.categoryId === video.categoryId);
  categoryVideos.sort((a, b) => a.order - b.order);
  
  const videoOrderIndex = categoryVideos.findIndex(v => v.id === id);
  
  // Already at the bottom
  if (videoOrderIndex === categoryVideos.length - 1) return false;
  
  const videoBelow = categoryVideos[videoOrderIndex + 1];
  
  // Swap orders
  const tempOrder = video.order;
  video.order = videoBelow.order;
  videoBelow.order = tempOrder;
  
  saveVideos(videos);
  
  // Dispatch specific event for order changes
  window.dispatchEvent(new CustomEvent('video-order-changed'));
  
  return true;
};

// Toggle featured status for a video
export const toggleVideoFeatured = (id: string): boolean => {
  const videos = loadVideos();
  const videoToUpdate = videos.find(v => v.id === id);
  
  if (!videoToUpdate) return false;

  // Count current featured videos in the same category
  const categoryFeaturedCount = videos.filter(
    v => v.categoryId === videoToUpdate.categoryId && v.featured && v.id !== id
  ).length;

  // Don't allow more than 4 featured videos per category
  if (!videoToUpdate.featured && categoryFeaturedCount >= 4) {
    return false;
  }

  // Update featured status
  const updatedVideos = videos.map(video => 
    video.id === id ? { ...video, featured: !video.featured } : video
  );
  
  saveVideos(updatedVideos);
  
  return !videoToUpdate.featured;
};

// Delete a video and reorder remaining videos
export const deleteVideo = (id: string): boolean => {
  const videos = loadVideos();
  const videoToDelete = videos.find(v => v.id === id);
  
  if (!videoToDelete) return false;
  
  const categoryId = videoToDelete.categoryId;
  const orderToDelete = videoToDelete.order;
  
  const filteredVideos = videos.filter(video => video.id !== id);
  
  // Reorder remaining videos in the same category
  filteredVideos.forEach(video => {
    if (video.categoryId === categoryId && video.order > orderToDelete) {
      video.order -= 1;
    }
  });
  
  saveVideos(filteredVideos);
  return true;
};
