import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, X, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import YouTubeEmbed, { getYoutubeId } from '../components/videos/YouTubeEmbed';
import { getVideosByCategory, getFeaturedInCategoryVideos } from '../services/videoService';
import { Video } from '../types';

// Import the service categories from the shared data location
// This is just a placeholder - you should use your actual data source
const serviceCategories = [
  {
    id: 'elearning',
    title: 'Customized e-Learning',
    titleThai: 'จัดทำหลักสูตรในรูปแบบที่ลูกค้าต้องการ',
    description: 'เราสร้างโซลูชัน e-Learning แบบปรับแต่งตามความต้องการเฉพาะขององค์กรของคุณ',
    descriptionEn: 'We create customized e-Learning solutions based on your organization\'s specific needs.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `e-Learning Project ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4
    }))
  },
  {
    id: 'video',
    title: 'Video Production',
    titleThai: 'ออกกองถ่ายทำในรูปแบบวิดีโอ',
    description: 'บริการผลิตวิดีโอมืออาชีพของเราสร้างเนื้อหาการเรียนรู้ที่น่าสนใจ',
    descriptionEn: 'Our professional video production services create engaging educational content.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Video Project ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4
    }))
  },
  {
    id: '360',
    title: '360 Matterport and 360 Virtual Tour & Training',
    titleThai: '360 Matterport และ Virtual Tour & Training แบบ 360°',
    description: 'จุ่มผู้ชมของคุณลงในสภาพแวดล้อมแบบ 360° ที่โต้ตอบได้',
    descriptionEn: 'Immerse your audience in interactive 360° environments.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `360° Tour ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4
    }))
  },
  {
    id: 'lms',
    title: 'Learning Management System (LMS)',
    titleThai: 'ระบบจัดการการเรียนรู้ (LMS)',
    description: 'โซลูชัน LMS แบบกำหนดเองของเราให้แพลตฟอร์มศูนย์กลางสำหรับการจัดส่ง',
    descriptionEn: 'Our custom LMS solutions provide a centralized platform for delivering content.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `LMS Solution ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4
    }))
  },
  {
    id: 'web',
    title: 'Web Design & Development',
    titleThai: 'ออกแบบและพัฒนาเว็บไซต์',
    description: 'เราสร้างเว็บไซต์ที่ทันสมัย ตอบสนองความต้องการ',
    descriptionEn: 'We create modern, responsive websites optimized for user experience.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Web Project ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4
    }))
  }
];

// We'll keep the videos data for reference but integrate directly with project items
const videosByCategory = {
  elearning: [
    {
      id: '1',
      title: 'Introduction to SCORM',
      titleThai: 'แนะนำ SCORM',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Learn about SCORM packages and how they work',
      descriptionThai: 'เรียนรู้เกี่ยวกับแพ็คเกจ SCORM และการทำงาน'
    },
    {
      id: '2',
      title: 'Creating Interactive Content',
      titleThai: 'การสร้างเนื้อหาเชิงโต้ตอบ',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'How to create engaging interactive learning content',
      descriptionThai: 'วิธีสร้างเนื้อหาการเรียนรู้เชิงโต้ตอบที่น่าสนใจ'
    }
  ],
  video: [
    {
      id: '3',
      title: 'Professional Video Production',
      titleThai: 'การผลิตวิดีโอระดับมืออาชีพ',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Tips for professional video production',
      descriptionThai: 'เคล็ดลับสำหรับการผลิตวิดีโอระดับมืออาชีพ'
    }
  ],
  '360': [
    {
      id: '4',
      title: '360° Virtual Tours Demo',
      titleThai: 'สาธิตทัวร์เสมือนจริงแบบ 360°',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Demonstration of our 360° virtual tour capabilities',
      descriptionThai: 'การสาธิตความสามารถในการท่องเที่ยวเสมือนจริง 360° ของเรา'
    }
  ],
  lms: [
    {
      id: '5',
      title: 'LMS Implementation Guide',
      titleThai: 'คู่มือการใช้งานระบบ LMS',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Step-by-step guide to implementing a Learning Management System',
      descriptionThai: 'คู่มือการใช้งานระบบจัดการการเรียนรู้ทีละขั้นตอน'
    }
  ],
  web: [
    {
      id: '6',
      title: 'Web Design Principles',
      titleThai: 'หลักการออกแบบเว็บ',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Core principles of effective web design',
      descriptionThai: 'หลักการพื้นฐานของการออกแบบเว็บที่มีประสิทธิภาพ'
    }
  ]
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { i18n } = useTranslation();
  const isThaiLanguage = i18n.language === 'th';
  const [selectedVideo, setSelectedVideo] = useState<{id: number, url: string, title: string} | null>(null);
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 5 rows × 4 columns
  
  // Find the selected category (if there is one)
  const selectedCategory = categoryId 
    ? serviceCategories.find(cat => cat.id === categoryId)
    : null;
  
  // Determine which categories to display
  const categoriesToShow = selectedCategory ? [selectedCategory] : serviceCategories;

  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const openVideoModal = (item: {id: number, title: string, youtubeUrl: string}) => {
    if (item.youtubeUrl) {
      setSelectedVideo({
        id: item.id,
        url: item.youtubeUrl,
        title: item.title
      });
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Add state for videos
  const [categoryVideos, setCategoryVideos] = useState<Video[]>([]);
  
  // Load videos for this category on mount and when categoryId changes
  useEffect(() => {
    const loadCategoryVideos = () => {
      if (categoryId) {
        // Get videos from the selected category - preserve exact order from admin panel
        const videos = getVideosByCategory(categoryId);
        setCategoryVideos(videos);
        
        // Reset to page 1 when videos change to ensure new videos are visible
        setCurrentPage(1);
      } else {
        // For the main page, load featured videos for each category
        const allFeaturedVideos = [];
        serviceCategories.forEach(category => {
          const featuredVideos = getFeaturedInCategoryVideos(category.id);
          allFeaturedVideos.push(...featuredVideos);
        });
        setCategoryVideos(allFeaturedVideos);
      }
    };
    
    loadCategoryVideos();
    
    // Listen for updates from the admin panel
    window.addEventListener('videos-updated', loadCategoryVideos);
    return () => window.removeEventListener('videos-updated', loadCategoryVideos);
  }, [categoryId]);
  
  // Get items for the current page - keep videos at top and preserve admin-defined order
  const getCurrentPageItems = (items: any[]) => {
    let displayItems = [...items.filter(item => item.isDisplayed)];
    
    // Videos are always displayed first, in their exact admin-defined order
    if (categoryVideos.length > 0) {
      const relevantVideos = categoryVideos.filter(video => !selectedCategory || video.categoryId === categoryId);
      
      // Convert videos to display format, preserving exact order from admin
      const videoItems = relevantVideos.map(video => ({
        id: video.id,
        title: isThaiLanguage && video.titleThai ? video.titleThai : video.title,
        description: isThaiLanguage && video.descriptionThai ? video.descriptionThai : video.description,
        isDisplayed: true,
        isFeatured: video.featured,
        youtubeUrl: video.youtubeUrl,
        thumbnail: video.thumbnail || video.imageUrl, // Support both thumbnail and imageUrl fields
        location: video.location,
        order: video.order,
        isVideo: true // Flag to identify this as a video item
      }));
      
      // Videos are always placed at the top in the exact same order as admin panel
      displayItems = [...videoItems, ...displayItems];
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayItems.slice(startIndex, startIndex + itemsPerPage);
  };
  
  // Calculate total pages including videos
  const calculateTotalPages = (items: any[]) => {
    let totalItems = items.filter(item => item.isDisplayed).length;
    
    // If we're displaying videos, add them to the count
    if (categoryVideos.length > 0) {
      if (selectedCategory) {
        // Only count videos for this category
        totalItems += categoryVideos.filter(v => v.categoryId === categoryId).length;
      } else {
        // Count all videos on main page
        totalItems += categoryVideos.length;
      }
    }
    
    return Math.ceil(totalItems / itemsPerPage);
  };
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    // Ensure page number is within valid range
    if (pageNumber < 1) pageNumber = 1;
    
    if (selectedCategory) {
      const totalPages = calculateTotalPages(selectedCategory.items.filter(item => item.isDisplayed));
      if (pageNumber > totalPages) pageNumber = totalPages;
    }
    
    setCurrentPage(pageNumber);
    
    // Scroll to top of the items grid
    window.scrollTo({
      top: document.getElementById('items-grid')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };
  
  // Get total pages for pagination
  const getTotalPages = () => {
    if (!selectedCategory) return 1;
    const displayedItems = selectedCategory.items.filter(item => item.isDisplayed);
    return calculateTotalPages(displayedItems);
  };
  
  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return [];
    
    // Always show current page, first, and last page
    // For larger page sets, show a window around current page and use ellipsis
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

  // No category found
  if (categoryId && !selectedCategory) {
    return <div className="container mx-auto px-4 py-10">Category not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center text-blue-600 mb-4">
        <ChevronLeft size={18} />
        <span className="ml-1">{isThaiLanguage ? 'กลับไปหน้าหลัก' : 'Back to Home'}</span>
      </Link>
      
      {selectedCategory ? (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{selectedCategory.title}</h1>
          <h2 className="text-xl text-gray-700 mb-4">{selectedCategory.titleThai}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {isThaiLanguage ? selectedCategory.description : selectedCategory.descriptionEn}
          </p>
        </div>
      ) : (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isThaiLanguage ? 'หมวดหมู่บริการทั้งหมด' : 'All Service Categories'}
          </h1>
        </div>
      )}
      
      {/* Display each category */}
      {categoriesToShow.map(category => (
        <div key={category.id} className="mb-16">
          {!selectedCategory && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">{category.title}</h2>
              <h3 className="text-lg text-gray-700 mb-3">{category.titleThai}</h3>
              <p className="text-gray-600 max-w-4xl">
                {isThaiLanguage ? category.description : category.descriptionEn}
              </p>
            </div>
          )}
          
          {/* Projects Grid with integrated videos - paginated to 5 rows with 4 columns */}
          <div id="items-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(selectedCategory 
              ? getCurrentPageItems(category.items)
              : 
              // For homepage view, get featured items but maintain video order
              [...categoryVideos
                .filter(video => video.categoryId === category.id && video.featured)
                .map(video => ({
                  id: video.id,
                  title: isThaiLanguage && video.titleThai ? video.titleThai : video.title,
                  description: isThaiLanguage && video.descriptionThai ? video.descriptionThai : video.description,
                  isDisplayed: true,
                  isFeatured: video.featured,
                  youtubeUrl: video.youtubeUrl,
                  thumbnail: video.thumbnail || video.imageUrl, // Support both fields
                  isVideo: true
                })),
                ...category.items.filter(item => item.isDisplayed && item.isFeatured)
              ].slice(0, 8)
            ).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Use thumbnail or imageUrl for the image source */}
                  <img
                    src={item.thumbnail || item.imageUrl || "https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  
                  {/* Video play button overlay for items with YouTube URLs */}
                  {item.youtubeUrl && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 cursor-pointer transition-all"
                      onClick={() => openVideoModal(item as any)}
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Play size={24} className="text-blue-600 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {/* Display Thai title if available and language is Thai */}
                    {isThaiLanguage && item.titleThai ? item.titleThai : item.title}
                  </h3>
                  
                  {!item.isVideo && item.rating && (
                    <div className="flex items-center mb-4">
                      {renderRating(item.rating)}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {!item.isVideo && item.price && (
                      <span className="text-gray-900 font-medium">฿{item.price.toFixed(2)}</span>
                    )}
                    
                    {/* Display Thai description if available and language is Thai */}
                    {(item.description || item.descriptionThai) && (
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {isThaiLanguage && item.descriptionThai ? item.descriptionThai : item.description}
                      </span>
                    )}
                    
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination - Only show for category detail page with multiple pages */}
          {selectedCategory && getTotalPages() > 1 && (
            <div className="mt-10 flex flex-wrap justify-center items-center">
              {/* First page button */}
              <button 
                onClick={() => handlePageChange(1)}
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
                onClick={() => handlePageChange(currentPage - 1)}
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
              {generatePageNumbers().map((page, index) => (
                page === 'ellipsis1' || page === 'ellipsis2' ? (
                  <span 
                    key={`ellipsis-${index}`}
                    className="mx-1 w-10 h-10 flex items-center justify-center text-gray-700"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page as number)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === getTotalPages()}
                className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                  currentPage === getTotalPages() 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
              
              {/* Last page button */}
              <button 
                onClick={() => handlePageChange(getTotalPages())}
                disabled={currentPage === getTotalPages()}
                className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                  currentPage === getTotalPages() 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Last page"
              >
                <ChevronsRight size={18} />
              </button>
              
              {/* Page indicator */}
              <span className="ml-4 text-sm text-gray-700">
                {isThaiLanguage 
                  ? `หน้า ${currentPage} จาก ${getTotalPages()}` 
                  : `Page ${currentPage} of ${getTotalPages()}`}
              </span>
            </div>
          )}
          
          {!selectedCategory && (
            <div className="mt-6 text-right">
              <Link to={`/category/${category.id}`} className="text-blue-600 hover:underline">
                {isThaiLanguage ? 'ดูทั้งหมด' : 'View All'} →
              </Link>
            </div>
          )}
        </div>
      ))}
      
      {/* Video Modal Popup */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden relative"
            >
              <div className="p-4 bg-gray-100 flex justify-between items-center">
                <h3 className="font-medium text-lg line-clamp-1">{selectedVideo.title}</h3>
                <button 
                  onClick={closeVideoModal}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative">
                <YouTubeEmbed 
                  videoId={getYoutubeId(selectedVideo.url)} 
                  title={selectedVideo.title}
                  className="aspect-video" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-12 text-center">
        <Link to="/contact" className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
          {isThaiLanguage ? 'ติดต่อเรา' : 'Contact Us'}
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;
