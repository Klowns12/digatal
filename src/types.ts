import { Video } from '../types';

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
    order: 2
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

// Get videos by category
export const getVideosByCategory = (categoryId: string): Video[] => {
  return loadVideos().filter(video => video.categoryId === categoryId);
};

// Get a specific video
export const getVideo = (id: string): Video | undefined => {
  return loadVideos().find(video => video.id === id);
};

// Add a new video
export const addVideo = (video: Omit<Video, 'id' | 'thumbnail'>): Video => {
  const videos = loadVideos();
  const newVideo: Video = {
    ...video,
    id: `video-${Date.now()}`,
    thumbnail: generateThumbnail(video.youtubeUrl),
    order: video.order !== undefined ? video.order : videos.length + 1 // Set order based on input or append to the end
  };
  
  saveVideos([...videos, newVideo]);
  return newVideo;
};

// Update a video
export const updateVideo = (id: string, updates: Partial<Video>): Video | null => {
  const videos = loadVideos();
  let updatedVideo: Video | null = null;
  
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
    return updatedVideo;
  }
  
  return null;
};

// Delete a video
export const deleteVideo = (id: string): boolean => {
  const videos = loadVideos();
  const filteredVideos = videos.filter(video => video.id !== id);
  
  if (filteredVideos.length < videos.length) {
    saveVideos(filteredVideos);
    return true;
  }
  
  return false;
};