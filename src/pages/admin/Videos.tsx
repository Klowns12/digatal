import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Edit, Play, Check, Star, MapPin, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Video } from '../../types';
import { 
  getVideos, 
  addVideo, 
  updateVideo, 
  deleteVideo, 
  getYoutubeId, 
  generateThumbnail,
  toggleVideoFeatured,
  moveVideoUp,
  moveVideoDown,
  getMaxOrderForCategory
} from '../../services/videoService';
import { toast } from "../../components/ui/use-toast";

// Sample categories for videos
const videoCategories = [
  { id: 'elearning', name: 'E-Learning' },
  { id: 'video', name: 'Video Production' },
  { id: '360', name: '360° Virtual Tours' },
  { id: 'lms', name: 'LMS' },
  { id: 'web', name: 'Web Development' }
];

const VideosAdmin = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'thai'>('english');
  const [filteredCategory, setFilteredCategory] = useState<string>('all');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Add selected category for adding new videos
  const [selectedCategory, setSelectedCategory] = useState(videoCategories[0].id);
  
  // Get max order for current category
  const [maxOrder, setMaxOrder] = useState<number>(0);
  
  // Load videos on component mount and when updated
  const loadVideos = () => {
    const currentVideos = getVideos();
    setVideos(currentVideos);
  };
  
  useEffect(() => {
    loadVideos();
    
    // Listen for updates from other components or browser tabs
    window.addEventListener('videos-updated', loadVideos);
    return () => window.removeEventListener('videos-updated', loadVideos);
  }, []);
  
  // Update max order when filtered category changes
  useEffect(() => {
    if (filteredCategory === 'all') {
      setMaxOrder(0);
    } else {
      const max = getMaxOrderForCategory(filteredCategory);
      setMaxOrder(max);
    }
  }, [filteredCategory, videos]);
  
  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsAdding(false);
  };
  
  const handleAdd = () => {
    // Get the max order for the selected category
    const currentMaxOrder = filteredCategory === 'all' 
      ? 0 
      : getMaxOrderForCategory(selectedCategory);
    
    setEditingVideo({
      id: `new-${Date.now()}`,
      title: 'New Video',
      titleThai: 'วิดีโอใหม่',
      description: '',
      descriptionThai: '',
      youtubeUrl: '',
      categoryId: selectedCategory,
      thumbnail: '',
      featured: false,
      location: '',
      order: currentMaxOrder + 1 // Default to putting at the end
    });
    setIsAdding(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideo(id);
      loadVideos();
    }
  };
  
  const handleCancel = () => {
    setEditingVideo(null);
    setIsAdding(false);
  };
  
  const handleSave = () => {
    if (editingVideo) {
      if (isAdding) {
        const { id, thumbnail, ...videoData } = editingVideo;
        const addedVideo = addVideo(videoData);
        
        // If this is a 360 video, also update services display
        if (videoData.categoryId === '360') {
          // Dispatch custom event for 360 videos specifically
          window.dispatchEvent(new CustomEvent('360-video-added', { detail: addedVideo }));
        }
      } else {
        const { id, ...updates } = editingVideo;
        updateVideo(id, updates);
      }
      
      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      
      loadVideos();
      setEditingVideo(null);
      setIsAdding(false);
    }
  };
  
  const handleChange = (field: keyof Video, value: string) => {
    if (editingVideo) {
      setEditingVideo({ ...editingVideo, [field]: value });
    }
  };
  
  // Add this function to count featured videos in a category
  const getFeaturedCount = (categoryId: string): number => {
    return videos.filter(v => v.categoryId === categoryId && v.featured).length;
  };
  
  // Toggle featured status for a video
  const handleToggleFeatured = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const featuredCount = getFeaturedCount(video.categoryId);
    
    // Check if trying to feature when already at limit
    if (!video.featured && featuredCount >= 4) {
      toast({
        title: "ไม่สามารถเพิ่มได้",
        description: "สามารถเลือกได้สูงสุด 4 รายการต่อหมวดหมู่",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const isFeatured = toggleVideoFeatured(videoId);
    
    // Update local state
    setVideos(prev => prev.map(v => 
      v.id === videoId ? { ...v, featured: isFeatured } : v
    ));
  };
  
  // Handle moving a video up in order
  const handleMoveUp = (videoId: string) => {
    if (moveVideoUp(videoId)) {
      loadVideos();
    }
  };
  
  // Handle moving a video down in order
  const handleMoveDown = (videoId: string) => {
    if (moveVideoDown(videoId)) {
      loadVideos();
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
      
      {/* Show success message when videos are updated */}
      {showSaveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-4">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <p>บันทึกการเปลี่ยนแปลงแล้ว</p>
        </div>
      )}
      
      {!editingVideo ? (
        <>
          {/* Category filter with selected category tracking */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">เลือกหมวดหมู่วิดีโอ:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setFilteredCategory('all');
                  setSelectedCategory(videoCategories[0].id);
                }}
                className={`px-3 py-1 text-sm rounded-full ${
                  filteredCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ทุกหมวดหมู่
              </button>
              
              {videoCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setFilteredCategory(category.id);
                    setSelectedCategory(category.id);
                  }}
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
          
          {/* Add notice about 360 videos */}
          {filteredCategory === '360' && (
            <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info size={16} className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    วิดีโอ 360° ที่เพิ่มในนี้จะปรากฏในหน้าบริการ 360° Virtual Tours โดยอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Videos grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos
              .sort((a, b) => a.order - b.order) // Sort by order
              .map(video => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                {/* Video thumbnail with play icon - fixed syntax */}
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
                      
                      {/* Show order number */}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                          ลำดับที่: {video.order}
                        </span>
                      </div>
                      
                      {/* Show location if available */}
                      {video.location && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="mr-1" />
                          <span>{video.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full mb-2">
                        {videoCategories.find(c => c.id === video.categoryId)?.name || 'Uncategorized'}
                      </span>
                      
                      {/* Featured status toggle button */}
                      {renderFeaturedBadge(video)}
                    </div>
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
                      {/* Add order control buttons */}
                      <button
                        onClick={() => handleMoveUp(video.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Move up"
                        disabled={video.order === 1}
                      >
                        <ArrowUp size={16} className={video.order === 1 ? "opacity-30" : ""} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(video.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Move down"
                      >
                        <ArrowDown size={16} />
                      </button>
                      
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
              <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่ถ่ายทำ</label>
              <input
                type="text"
                value={editingVideo.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="กรุงเทพฯ, เชียงใหม่, ภูเก็ต"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">ระบุสถานที่ถ่ายทำวิดีโอ (ไม่บังคับ)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับการแสดงผล</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={editingVideo.order || 1}
                  onChange={(e) => handleChange('order', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">จากทั้งหมด {maxOrder} รายการในหมวดหมู่นี้</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                กำหนดลำดับการแสดงผลของวิดีโอ หากไม่ระบุ จะถูกเพิ่มไว้ท้ายสุด
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={editingVideo.featured || false}
                onChange={(e) => handleChange('featured', e.target.checked ? 'true' : 'false')}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                แนะนำวิดีโอนี้ในหน้าหลัก
              </label>
            </div>
            
            {/* Add notice about 360 selection */}
            {editingVideo.categoryId === '360' && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info size={16} className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      วิดีโอในหมวด 360° จะถูกแสดงในหน้าบริการ 360° Virtual Tours โดยอัตโนมัติ
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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

// Add missing Info icon component
const Info = ({ size = 24, className = '' }) => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// Add this before the Info component
const renderFeaturedBadge = (video: Video) => {
  return (
    <button
      onClick={() => handleToggleFeatured(video.id)}
      className={`flex items-center px-2 py-1 rounded-full text-xs ${
        video.featured
          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
      }`}
      title={video.featured ? 'Remove from featured' : 'Add to featured'}
    >
      <Star
        size={12}
        className={`mr-1 ${video.featured ? 'fill-yellow-500' : ''}`}
      />
      {video.featured ? 'Featured' : 'Feature'}
    </button>
  );
};

export default VideosAdmin;