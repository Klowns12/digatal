import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Edit, Play } from 'lucide-react';
import { Video } from '../../types';

// Sample categories for videos
const videoCategories = [
  { id: 'elearning', name: 'E-Learning' },
  { id: 'video', name: 'Video Production' },
  { id: '360', name: '360° Virtual Tours' },
  { id: 'lms', name: 'LMS' },
  { id: 'web', name: 'Web Development' }
];

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
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
  },
  {
    id: '2',
    title: 'Video Production Basics',
    titleThai: 'พื้นฐานการผลิตวิดีโอ',
    description: 'Basic techniques for educational video production',
    descriptionThai: 'เทคนิคพื้นฐานสำหรับการผลิตวิดีโอเพื่อการศึกษา',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    categoryId: 'video',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
  }
];

const VideosAdmin = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'thai'>('english');
  const [filteredCategory, setFilteredCategory] = useState<string>('all');
  
  // Extract YouTube video ID from URL
  const getYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };
  
  // Generate thumbnail URL from YouTube URL
  const generateThumbnail = (url: string): string => {
    const videoId = getYoutubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  };
  
  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsAdding(false);
  };
  
  const handleAdd = () => {
    setEditingVideo({
      id: `new-${Date.now()}`,
      title: 'New Video',
      titleThai: 'วิดีโอใหม่',
      description: '',
      descriptionThai: '',
      youtubeUrl: '',
      categoryId: videoCategories[0].id,
      thumbnail: ''
    });
    setIsAdding(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };
  
  const handleCancel = () => {
    setEditingVideo(null);
    setIsAdding(false);
  };
  
  const handleSave = () => {
    if (editingVideo) {
      // Generate thumbnail from YouTube URL
      const updatedVideo = {
        ...editingVideo,
        thumbnail: generateThumbnail(editingVideo.youtubeUrl)
      };
      
      if (isAdding) {
        setVideos([...videos, updatedVideo]);
      } else {
        setVideos(videos.map(v => v.id === updatedVideo.id ? updatedVideo : v));
      }
      
      setEditingVideo(null);
      setIsAdding(false);
    }
  };
  
  const handleChange = (field: keyof Video, value: string) => {
    if (editingVideo) {
      setEditingVideo({ ...editingVideo, [field]: value });
    }
  };
  
  // Filter videos by category
  const filteredVideos = filteredCategory === 'all' 
    ? videos 
    : videos.filter(video => video.categoryId === filteredCategory);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.videos')}</h1>
        {!editingVideo && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {t('admin.add')}
          </button>
        )}
      </div>
      
      {!editingVideo ? (
        <>
          {/* Category filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilteredCategory('all')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filteredCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              
              {videoCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilteredCategory(category.id)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filteredCategory === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Videos grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                {/* Video thumbnail with play icon */}
                <div className="relative h-48 bg-gray-100">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <Play size={36} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <Play size={20} className="text-red-600 ml-1" />
                    </div>
                  </div>
                </div>
                
                {/* Video info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.titleThai}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {videoCategories.find(c => c.id === video.categoryId)?.name || 'Uncategorized'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {video.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      YouTube Link <ExternalLink size={14} className="ml-1"/>
                    </a>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Play size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No videos found</h3>
              <p className="text-gray-500">
                {filteredCategory === 'all' 
                  ? "You haven't added any videos yet" 
                  : "No videos in this category yet"}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {isAdding ? 'Add New Video' : 'Edit Video'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('english')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'english'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveTab('thai')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'thai'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Thai
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={activeTab === 'english' ? editingVideo.title : editingVideo.titleThai}
                onChange={(e) => handleChange(activeTab === 'english' ? 'title' : 'titleThai' as any, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={activeTab === 'english' ? editingVideo.description : editingVideo.descriptionThai}
                onChange={(e) => handleChange(activeTab === 'english' ? 'description' : 'descriptionThai' as any, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={editingVideo.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {editingVideo.youtubeUrl && getYoutubeId(editingVideo.youtubeUrl) && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img
                    src={generateThumbnail(editingVideo.youtubeUrl)}
                    alt="Video Thumbnail"
                    className="h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={editingVideo.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {videoCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('admin.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosAdmin;

// Add missing ExternalLink component
const ExternalLink = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);
