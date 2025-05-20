import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Service } from '../../types';
import { Trash2, Plus, Edit, Star, Home, Menu, Check, Settings, Eye, BookOpen, Video, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedItems, toggleItemFeatured } from '../../services/featuredItemsService';

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
  { id: 'dashboard', label: 'แดชบอร์ด', icon: Home },
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

// Updated mock data to match what's displayed in the frontend Services component
const allCategoriesItems: Record<string, Array<{id: string, title: string, featured: boolean}>> = {
  'elearning': Array.from({ length: 20 }, (_, i) => ({
    id: `elearn-${i + 1}`,
    title: `e-Learning Project ${i + 1}`,
    featured: [0, 1, 2, 11].includes(i) // Items 1, 2, 3, and 12 are featured
  })),
  'video': Array.from({ length: 20 }, (_, i) => ({
    id: `video-${i + 1}`,
    title: `Video Project ${i + 1}`,
    featured: i < 4 // First 4 are featured (1, 2, 3, 4)
  })),
  '360': Array.from({ length: 20 }, (_, i) => ({
    id: `360-${i + 1}`,
    title: `360° Tour ${i + 1}`,
    featured: i < 4 // First 4 are featured (1, 2, 3, 4)
  })),
  'lms': Array.from({ length: 20 }, (_, i) => ({
    id: `lms-${i + 1}`,
    title: `LMS Solution ${i + 1}`,
    featured: i < 4 // First 4 are featured (1, 2, 3, 4)
  })),
  'web': Array.from({ length: 20 }, (_, i) => ({
    id: `web-${i + 1}`,
    title: `Web Project ${i + 1}`,
    featured: i < 4 // First 4 are featured (1, 2, 3, 4)
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
  const [categoryItems, setCategoryItems] = useState<Record<string, Array<{id: string, title: string, featured: boolean}>>>({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    showPrices: true,
    showRatings: true,
    itemsPerPage: 20,
    defaultSort: 'newest'
  });
  
  // Load featured items on component mount
  useEffect(() => {
    const featuredItems = getFeaturedItems();
    
    // Convert from IDs to full items with featured flag
    const items: Record<string, Array<{id: string, title: string, featured: boolean}>> = {};
    
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
  }, []);
  
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
            const featuredCount = category.filter(item => item.featured).length;
            
            return (
              <div key={categoryId} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{categoryLabels[categoryId]}</h3>
                    <p className="text-sm text-gray-500">
                      รายการที่เลือก: {featuredCount}/4
                    </p>
                  </div>
                  {featuredCount === 4 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      เลือกครบ 4 รายการแล้ว
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.map((item) => (
                    <div 
                      key={item.id}
                      className={`border rounded-md p-4 transition-all ${
                        item.featured 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="truncate pr-2">
                          <p className="font-medium">{item.title}</p>
                        </div>
                        <button 
                          onClick={() => handleToggleItemFeatured(categoryId, item.id)}
                          className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                            item.featured 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }`}
                          disabled={!item.featured && featuredCount >= 4}
                        >
                          <Star size={14} fill={item.featured ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={saveHomepageSettings}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
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
                  id="showPrices"
                  checked={displaySettings.showPrices}
                  onChange={(e) => handleDisplaySettingChange('showPrices', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="showPrices" className="ml-2">แสดงราคา</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showRatings"
                  checked={displaySettings.showRatings}
                  onChange={(e) => handleDisplaySettingChange('showRatings', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="showRatings" className="ml-2">แสดงการให้คะแนน</label>
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
                {['newest', 'oldest', 'nameAsc', 'nameDesc', 'priceAsc', 'priceDesc'].map((sortOption) => {
                  const labels: Record<string, string> = {
                    newest: 'ใหม่ล่าสุด',
                    oldest: 'เก่าสุด',
                    nameAsc: 'ชื่อ A-Z',
                    nameDesc: 'ชื่อ Z-A',
                    priceAsc: 'ราคาต่ำ-สูง',
                    priceDesc: 'ราคาสูง-ต่ำ'
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