import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Service } from '../../types';
import { Trash2, Plus, Edit, Star, Home, Menu, Check, Settings, Eye, BookOpen, Video, Image, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedItems, toggleItemFeatured } from '../../services/featuredItemsService';
import { getVideosByCategory, getFeaturedInCategoryVideos, toggleVideoFeatured, updateVideo } from '../../services/videoService';
import { get360TourItems } from '../../services/featureService';

// Placeholder data
const initialServices: Service[] = [
  {
    id: '1',
    title: 'Customized e-Learning',
    titleThai: 'Customized e-Learning',
    description: 'Custom e-Learning courses tailored to your needs',
    descriptionThai: 'จัดทำหลักสูตรในรูปแบบที่ลูกค้าต้องการ',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    title: 'Video Production',
    titleThai: 'Video Production',
    description: 'Professional video production for educational content',
    descriptionThai: 'ออกแบบทำวีดีโอในรูปแบบวีดีโอ',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

// Add missing Play icon component
const Play = ({ size = 24, className = '' }) => (
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
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

// Add admin section navigation
const adminSections = [
  { id: 'services', label: 'บริการ', icon: Settings },
  { id: 'content', label: 'เนื้อหาเว็บไซต์', icon: Menu },
  { id: 'videos', label: 'วิดีโอ', icon: Play },
  { id: 'images', label: 'รูปภาพ', icon: Image },
  { id: 'courses', label: 'คอร์สเรียน', icon: BookOpen }
];

// Category labels for display
const categoryLabels: Record<string, string> = {
  'elearning': 'Customized e-Learning',
  'video': 'Video Production',
  '360': '360 Matterport and Virtual Tour',
  'lms': 'Learning Management System (LMS)',
  'web': 'Web Design & Development'
};

// Update the mock data structure to include descriptions instead of prices/ratings
const allCategoriesItems: Record<string, Array<{id: string, title: string, description: string, featured: boolean}>> = {
  'elearning': Array.from({ length: 20 }, (_, i) => ({
    id: `elearn-${i + 1}`,
    title: `e-Learning Project ${i + 1}`,
    description: `Short description for e-Learning project ${i + 1} showcasing key features and benefits.`,
    featured: [0, 1, 2, 11].includes(i)
  })),
  'video': Array.from({ length: 20 }, (_, i) => ({
    id: `video-${i + 1}`,
    title: `Video Project ${i + 1}`,
    description: `Brief overview of video project ${i + 1} highlighting production quality and educational value.`,
    featured: i < 4
  })),
  '360': Array.from({ length: 20 }, (_, i) => ({
    id: `360-${i + 1}`,
    title: `360° Tour ${i + 1}`,
    description: `Immersive 360° virtual experience ${i + 1} allowing viewers to explore environments interactively.`,
    featured: i < 4
  })),
  'lms': Array.from({ length: 20 }, (_, i) => ({
    id: `lms-${i + 1}`,
    title: `LMS Solution ${i + 1}`,
    description: `Comprehensive learning management solution ${i + 1} with analytics and user tracking capabilities.`,
    featured: i < 4
  })),
  'web': Array.from({ length: 20 }, (_, i) => ({
    id: `web-${i + 1}`,
    title: `Web Project ${i + 1}`,
    description: `Responsive, user-friendly website ${i + 1} designed to meet specific client requirements and goals.`,
    featured: i < 4
  }))
};

const ServicesAdmin = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'thai'>('english');
  
  // Add state for homepage feature management
  const [activeView, setActiveView] = useState<'services' | 'homepage' | 'display'>('services');
  const [categoryItems, setCategoryItems] = useState<Record<string, Array<{id: string, title: string, featured: boolean, description?: string}>>>({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    showDescriptions: true,
    truncateDescriptions: true,
    itemsPerPage: 20,
    defaultSort: 'newest'
  });
  
  // Store videos for all categories
  const [categoryVideos, setCategoryVideos] = useState<Record<string, Array<any>>>({});
  
  // Add pagination state for the homepage view
  const [categoryPagination, setCategoryPagination] = useState<Record<string, number>>({});
  const itemsPerPage = 20;
  
  // Load featured items and videos on component mount
  useEffect(() => {
    const featuredItems = getFeaturedItems();
    
    // Convert from IDs to full items with featured flag
    const items: Record<string, Array<{id: string, title: string, featured: boolean, description: string}>> = {};
    
    Object.keys(allCategoriesItems).forEach(categoryId => {
      const featuredIds = featuredItems[categoryId] || [];
      
      items[categoryId] = allCategoriesItems[categoryId].map((item) => {
        const itemId = parseInt(item.id.split('-')[1]);
        return {
          ...item,
          featured: featuredIds.includes(itemId)
        };
      });
    });
    
    setCategoryItems(items);
    
    // Load videos for all categories
    const videos: Record<string, Array<any>> = {};
    Object.keys(allCategoriesItems).forEach(categoryId => {
      videos[categoryId] = getVideosByCategory(categoryId);
    });
    setCategoryVideos(videos);
    
    // Initialize pagination for each category
    const initialPagination: Record<string, number> = {};
    Object.keys(allCategoriesItems).forEach(categoryId => {
      initialPagination[categoryId] = 1; // Start at page 1 for each category
    });
    setCategoryPagination(initialPagination);
    
    // Listen for video updates
    window.addEventListener('videos-updated', loadAllVideos);
    return () => window.removeEventListener('videos-updated', loadAllVideos);
  }, []);
  
  // Add event listener for homepage item updates
  useEffect(() => {
    const handleHomepageUpdate = () => {
      loadVideos();
      Object.keys(categoryItems).forEach(categoryId => {
        getCategoryItemsWithFeatured(categoryId).then(items => {
          setCategoryItems(prev => ({
            ...prev,
            [categoryId]: items
          }));
        });
      });
    };

    window.addEventListener('homepage-items-updated', handleHomepageUpdate);
    window.addEventListener('video-featured-changed', handleHomepageUpdate);
    
    return () => {
      window.removeEventListener('homepage-items-updated', handleHomepageUpdate);
      window.removeEventListener('video-featured-changed', handleHomepageUpdate);
    };
  }, []);
  
  const loadAllVideos = () => {
    const videos: Record<string, Array<any>> = {};
    Object.keys(allCategoriesItems).forEach(categoryId => {
      videos[categoryId] = getVideosByCategory(categoryId);
    });
    setCategoryVideos(videos);
  };
  
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsAdding(false);
  };
  
  const handleAdd = () => {
    setEditingService({
      id: `new-${Date.now()}`,
      title: 'New Service',
      titleThai: 'บริการใหม่',
      description: '',
      descriptionThai: '',
      imageUrl: ''
    });
    setIsAdding(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };
  
  const handleCancel = () => {
    setEditingService(null);
    setIsAdding(false);
  };
  
  const handleSave = () => {
    if (editingService) {
      if (isAdding) {
        setServices([...services, editingService]);
      } else {
        setServices(services.map(s => s.id === editingService.id ? editingService : s));
      }
      setEditingService(null);
      setIsAdding(false);
    }
  };
  
  const handleChange = (field: keyof Service, value: string) => {
    if (editingService) {
      if (activeTab === 'english' && (field === 'title' || field === 'description')) {
        setEditingService({ ...editingService, [field]: value });
      } else if (activeTab === 'thai' && field === 'title') {
        setEditingService({ ...editingService, titleThai: value });
      } else if (activeTab === 'thai' && field === 'description') {
        setEditingService({ ...editingService, descriptionThai: value });
      } else {
        setEditingService({ ...editingService, [field]: value });
      }
    }
  };
  
  // New handler for toggling featured items that uses the service
  const handleToggleItemFeatured = (categoryId: string, itemId: string) => {
    // Extract numeric ID from string ID (e.g., "elearn-5" -> 5)
    const numericId = parseInt(itemId.split('-')[1]);
    
    // Toggle using the service
    const isFeatured = toggleItemFeatured(categoryId, numericId);
    
    // Update local state
    setCategoryItems(prev => {
      return {
        ...prev,
        [categoryId]: prev[categoryId].map(item => 
          item.id === itemId ? { ...item, featured: isFeatured } : item
        )
      };
    });
  };
  
  // Update handleToggleVideoFeatured
  const handleToggleVideoFeatured = (categoryId: string, videoId: string) => {
    const featured = toggleVideoFeatured(videoId);
    
    // Update local state
    setCategoryVideos(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(video => 
        video.id === videoId ? { ...video, featured } : video
      )
    }));

    return featured;
  };
  
  const saveHomepageSettings = () => {
    // In a real application, you'd save this to your backend
    console.log('Saving homepage featured items:', categoryItems);
    
    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleDisplaySettingChange = (setting: string, value: any) => {
    setDisplaySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveDisplaySettings = () => {
    console.log('Saving display settings:', displaySettings);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };
  
  // Get items for the current page in a category
  const getCurrentPageItems = (categoryId: string, items: any[], videos: any[]) => {
    const currentPage = categoryPagination[categoryId] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    // Ensure videos have the correct featured status
    const processedVideos = videos.map(video => ({
      ...video,
      isVideo: true // Add flag to identify video items
    }));
    
    // Combine videos and regular items
    const combinedItems = [...processedVideos, ...items];
    
    return combinedItems.slice(startIndex, startIndex + itemsPerPage);
  };
  
  // Calculate total pages for a category
  const calculateTotalPages = (categoryId: string) => {
    const items = categoryItems[categoryId] || [];
    const videos = categoryVideos[categoryId] || [];
    const totalItems = items.length + videos.length;
    
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  };
  
  // Handle page change for a specific category
  const handlePageChange = (categoryId: string, pageNumber: number) => {
    const totalPages = calculateTotalPages(categoryId);
    
    // Ensure page number is within valid range
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    
    setCategoryPagination(prev => ({
      ...prev,
      [categoryId]: pageNumber
    }));
  };
  
  // Generate page numbers for pagination
  const generatePageNumbers = (categoryId: string) => {
    const currentPage = categoryPagination[categoryId] || 1;
    const totalPages = calculateTotalPages(categoryId);
    
    if (totalPages <= 1) return [];
    
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always add page 1
      pageNumbers.push(1);
      
      // Add ellipsis if current page is more than 3
      if (currentPage > 3) {
        pageNumbers.push('ellipsis1');
      }
      
      // Add a window around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if current page is less than total pages - 2
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis2');
      }
      
      // Always add last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  // Add state for item editing
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItemType, setEditingItemType] = useState<'regular' | 'video'>('regular');
  const [editItemActiveTab, setEditItemActiveTab] = useState<'english' | 'thai'>('english');
  
  // Handle opening the item edit modal
  const handleEditItem = (item: any, type: 'regular' | 'video', categoryId: string) => {
    // Create a copy of the item to edit
    const itemToEdit = { ...item, categoryId };
    setEditingItem(itemToEdit);
    setEditingItemType(type);
    setIsEditingItem(true);
    setEditItemActiveTab('english');
  };
  
  // Handle canceling item edit
  const handleCancelEditItem = () => {
    setEditingItem(null);
    setIsEditingItem(false);
  };
  
  // Handle saving edited item
  const handleSaveEditedItem = () => {
    if (!editingItem) return;
    
    if (editingItemType === 'video') {
      // Update video in the service
      updateVideo(editingItem.categoryId, editingItem.id, editingItem);
      
      // Update local state
      setCategoryVideos(prev => {
        return {
          ...prev,
          [editingItem.categoryId]: prev[editingItem.categoryId].map(video => 
            video.id === editingItem.id ? editingItem : video
          )
        };
      });
    } else {
      // Update regular item in the state
      setCategoryItems(prev => {
        return {
          ...prev,
          [editingItem.categoryId]: prev[editingItem.categoryId].map(item => 
            item.id === editingItem.id ? editingItem : item
          )
        };
      });
    }
    
    // Close the edit modal
    setEditingItem(null);
    setIsEditingItem(false);
    
    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };
  
  // Handle change in item field values
  const handleEditItemChange = (field: string, value: any) => {
    if (!editingItem) return;
    
    if (editItemActiveTab === 'english' && (field === 'title' || field === 'description')) {
      setEditingItem({ ...editingItem, [field]: value });
    } else if (editItemActiveTab === 'thai') {
      if (field === 'title') {
        setEditingItem({ ...editingItem, titleThai: value });
      } else if (field === 'description') {
        setEditingItem({ ...editingItem, descriptionThai: value });
      }
    } else {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };
  
  // Delete an item
  const handleDeleteItem = (item: any, type: 'regular' | 'video', categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    if (type === 'video') {
      // Delete video from local state (in a real app, you would call an API)
      setCategoryVideos(prev => {
        return {
          ...prev,
          [categoryId]: prev[categoryId].filter(video => video.id !== item.id)
        };
      });
    } else {
      // Delete regular item from local state
      setCategoryItems(prev => {
        return {
          ...prev,
          [categoryId]: prev[categoryId].filter(regularItem => regularItem.id !== item.id)
        };
      });
    }
    
    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };
  
  return (
    <div>
      {/* Admin Navigation */}
      <div className="bg-white shadow-sm rounded-lg mb-6 overflow-x-auto">
        <div className="flex p-1">
          {adminSections.map(section => (
            <Link 
              key={section.id}
              to={`/admin/${section.id}`}
              className={`px-4 py-3 flex items-center whitespace-nowrap rounded-md mx-1 ${
                section.id === 'services' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon size={18} className="mr-2" />
              {section.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.services')}</h1>
        
        <div className="flex space-x-3">
          {/* View Toggle Buttons */}
          <button
            onClick={() => setActiveView('services')}
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              activeView === 'services'
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Menu size={16} className="mr-1" />
            จัดการบริการ
          </button>
          <button
            onClick={() => setActiveView('homepage')}
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              activeView === 'homepage'
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Home size={16} className="mr-1" />
            รายการในหน้าหลัก
          </button>
          <button
            onClick={() => setActiveView('display')}
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              activeView === 'display'
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye size={16} className="mr-1" />
            การแสดงผล
          </button>
          
          {activeView === 'services' && !editingService && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              {t('admin.add')}
            </button>
          )}
        </div>
      </div>
      
      {showSaveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-4">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <p>บันทึกการเปลี่ยนแปลงแล้ว</p>
        </div>
      )}
      
      {/* Services View */}
      {activeView === 'services' && (
        !editingService ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.imageUrl && (
                        <img src={service.imageUrl} alt={service.title} className="h-12 w-12 rounded-md object-cover" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {service.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {isAdding ? 'Add New Service' : 'Edit Service'}
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
                  value={activeTab === 'english' ? editingService.title : editingService.titleThai}
                  onChange={(e) => handleChange(activeTab === 'english' ? 'title' : 'titleThai' as any, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={activeTab === 'english' ? editingService.description : editingService.descriptionThai}
                  onChange={(e) => handleChange(activeTab === 'english' ? 'description' : 'descriptionThai' as any, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingService.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {editingService.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editingService.imageUrl}
                      alt="Preview"
                      className="h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={editingService.youtubeUrl}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {editingService.youtubeUrl && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <Check size={12} className="mr-1" />
                    YouTube URL ถูกต้อง
                  </p>
                )}
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
        )
      )}
      
      {/* Homepage Featured Items View */}
      {activeView === 'homepage' && (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-blue-800 font-medium mb-2">จัดการรายการที่แสดงในหน้าหลัก</h3>
            <p className="text-blue-700 text-sm">เลือกรายการที่ต้องการให้แสดงในหน้าหลัก (สูงสุด 4 รายการต่อหมวด)</p>
          </div>

          {Object.keys(categoryItems).map((categoryId) => {
            const category = categoryItems[categoryId];
            const videos = categoryVideos[categoryId] || [];
            
            // Count featured items (both regular items and videos)
            const featuredItemsCount = category.filter(item => item.featured).length;
            const featuredVideosCount = videos.filter(video => video.featured).length;
            const totalFeaturedCount = featuredItemsCount + featuredVideosCount;
            
            // Get total count of all items (videos + regular items)
            const totalItems = category.length + videos.length;
            const totalPages = calculateTotalPages(categoryId);
            const currentPage = categoryPagination[categoryId] || 1;
            
            // Get items for current page
            const currentPageItems = getCurrentPageItems(categoryId, category, videos);
            
            return (
              <div key={categoryId} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{categoryLabels[categoryId]}</h3>
                    <p className="text-sm text-gray-500">
                      รายการที่เลือก: {totalFeaturedCount}/4
                    </p>
                  </div>
                  {totalFeaturedCount === 4 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      เลือกครบ 4 รายการแล้ว
                    </span>
                  )}
                  {categoryId === 'video' && (
                    <Link to="/admin/videos" className="text-blue-600 hover:underline flex items-center text-sm">
                      <Video size={16} className="mr-1" />
                      จัดการวิดีโอ
                    </Link>
                  )}
                </div>
                
                {/* Display current page items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentPageItems.map((item) => {
                    const isVideo = item.isVideo;
                    const isFeatured = isVideo ? item.featured : item.featured;
                    
                    return (
                      <div 
                        key={isVideo ? `video-${item.id}` : item.id}
                        className={`border rounded-md p-4 transition-all ${
                          isFeatured
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="pr-2 flex-grow">
                            <p className="font-medium truncate">{item.title}</p>
                            {isVideo && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                                Video
                              </span>
                            )}
                            {item.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            {/* Edit button */}
                            <button 
                              onClick={() => handleEditItem(item, isVideo ? 'video' : 'regular', categoryId)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit item"
                            >
                              <Edit size={14} />
                            </button>
                            
                            {/* Delete button */}
                            <button 
                              onClick={() => handleDeleteItem(item, isVideo ? 'video' : 'regular', categoryId)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                            
                            {/* Star button */}
                            <button 
                              onClick={() => {
                                if (isVideo) {
                                  handleToggleVideoFeatured(categoryId, item.id);
                                } else {
                                  handleToggleItemFeatured(categoryId, item.id);
                                }
                              }}
                              className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                                isFeatured
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                              }`}
                              disabled={!isFeatured && totalFeaturedCount >= 4}
                            >
                              <Star size={14} fill={isFeatured ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination controls - Only show if total pages > 1 */}
                {totalPages > 1 && (
                  <div className="mt-6 flex flex-wrap justify-center items-center">
                    {/* First page button */}
                    <button 
                      onClick={() => handlePageChange(categoryId, 1)}
                      disabled={currentPage === 1}
                      className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label="First page"
                    >
                      <ChevronsLeft size={18} />
                    </button>
                    
                    {/* Previous page button */}
                    <button 
                      onClick={() => handlePageChange(categoryId, currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    {/* Page numbers */}
                    {generatePageNumbers(categoryId).map((page, index) => (
                      page === 'ellipsis1' || page === 'ellipsis2' ? (
                        <span 
                          key={`ellipsis-${index}-${categoryId}`}
                          className="mx-1 w-10 h-10 flex items-center justify-center text-gray-700"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${page}-${categoryId}`}
                          onClick={() => handlePageChange(categoryId, page as number)}
                          className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                            currentPage === page 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                    
                    {/* Next page button */}
                    <button 
                      onClick={() => handlePageChange(categoryId, currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                    
                    {/* Last page button */}
                    <button 
                      onClick={() => handlePageChange(categoryId, totalPages)}
                      disabled={currentPage === totalPages}
                      className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label="Last page"
                    >
                      <ChevronsRight size={18} />
                    </button>
                    
                    {/* Page indicator */}
                    <span className="ml-4 text-sm text-gray-700">
                      หน้า {currentPage} จาก {totalPages}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Save Button for Homepage Settings */}
          <div className="flex justify-end mt-6">
            <button
              onClick={saveHomepageSettings}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              บันทึกรายการในหน้าหลัก
            </button>
          </div>
        </div>
      )}
      
      {/* Item Edit Modal */}
      {isEditingItem && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                {editingItemType === 'video' ? 'แก้ไขวิดีโอ' : 'แก้ไขรายการ'}
              </h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditItemActiveTab('english')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    editItemActiveTab === 'english'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setEditItemActiveTab('thai')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    editItemActiveTab === 'thai'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Thai
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title / ชื่อรายการ</label>
                <input
                  type="text"
                  value={editItemActiveTab === 'english' ? editingItem.title : (editingItem.titleThai || '')}
                  onChange={(e) => handleEditItemChange(editItemActiveTab === 'english' ? 'title' : 'titleThai', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / รายละเอียด</label>
                <textarea
                  value={editItemActiveTab === 'english' ? editingItem.description : (editingItem.descriptionThai || '')}
                  onChange={(e) => handleEditItemChange(editItemActiveTab === 'english' ? 'description' : 'descriptionThai', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>
              
              {/* YouTube URL field - shown for all items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={editingItem.youtubeUrl || ''}
                  onChange={(e) => handleEditItemChange('youtubeUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {editingItem.youtubeUrl && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <Check size={12} className="mr-1" />
                    YouTube URL ถูกต้อง
                  </p>
                )}
              </div>
              
              {/* Thumbnail/Image URL field - shown for all items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL / URL รูปภาพ</label>
                <input
                  type="text"
                  value={editingItemType === 'video' ? (editingItem.thumbnail || '') : (editingItem.imageUrl || '')}
                  onChange={(e) => handleEditItemChange(editingItemType === 'video' ? 'thumbnail' : 'imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="https://example.com/image.jpg"
                />
                
                {(editingItemType === 'video' ? editingItem.thumbnail : editingItem.imageUrl) && (
                  <div className="mt-2">
                    <img
                      src={editingItemType === 'video' ? editingItem.thumbnail : editingItem.imageUrl}
                      alt="Preview"
                      className="h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={handleCancelEditItem}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveEditedItem}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Display Settings View */}
      {activeView === 'display' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">การตั้งค่าการแสดงผล</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">การแสดงข้อมูล</h3>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="showDescriptions"
                  checked={displaySettings.showDescriptions}
                  onChange={(e) => handleDisplaySettingChange('showDescriptions', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="showDescriptions" className="ml-2">แสดงรายละเอียดใต้หัวข้อ</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="truncateDescriptions"
                  checked={displaySettings.truncateDescriptions}
                  onChange={(e) => handleDisplaySettingChange('truncateDescriptions', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="truncateDescriptions" className="ml-2">จำกัดความยาวรายละเอียด</label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">จำนวนรายการต่อหน้า</h3>
              <select
                value={displaySettings.itemsPerPage}
                onChange={(e) => handleDisplaySettingChange('itemsPerPage', parseInt(e.target.value))}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 w-32"
              >
                <option value={12}>12 รายการ</option>
                <option value={16}>16 รายการ</option>
                <option value={20}>20 รายการ</option>
                <option value={24}>24 รายการ</option>
                <option value={32}>32 รายการ</option>
              </select>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">การเรียงลำดับเริ่มต้น</h3>
              <div className="flex flex-wrap gap-3">
                {['newest', 'oldest', 'nameAsc', 'nameDesc'].map((sortOption) => {
                  const labels: Record<string, string> = {
                    newest: 'ใหม่ล่าสุด',
                    oldest: 'เก่าสุด',
                    nameAsc: 'ชื่อ A-Z',
                    nameDesc: 'ชื่อ Z-A'
                  };
                  
                  return (
                    <label 
                      key={sortOption} 
                      className={`px-4 py-2 border rounded-md cursor-pointer ${
                        displaySettings.defaultSort === sortOption
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="defaultSort"
                        value={sortOption}
                        checked={displaySettings.defaultSort === sortOption}
                        onChange={() => handleDisplaySettingChange('defaultSort', sortOption)}
                        className="sr-only"
                      />
                      {labels[sortOption]}
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={saveDisplaySettings}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                บันทึกการตั้งค่าการแสดงผล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdmin;