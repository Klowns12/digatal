import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Eye, EyeOff, Check } from 'lucide-react';

// Sample categories for organization
const categories = [
  { id: 'elearning', name: 'E-Learning' },
  { id: 'video', name: 'Video Production' },
  { id: '360', name: '360° Virtual Tours' },
  { id: 'lms', name: 'LMS' },
  { id: 'web', name: 'Web Development' }
];

// Sample items data with display flags
const sampleItems = [
  ...Array(10).fill(null).map((_, i) => ({
    id: `e${i+1}`,
    title: `E-Learning Project ${i+1}`,
    categoryId: 'elearning',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    isFeatured: i < 4, // First 4 are featured by default
    isDisplayed: true, // All are displayed by default
    rating: 4
  })),
  ...Array(8).fill(null).map((_, i) => ({
    id: `v${i+1}`,
    title: `Video Project ${i+1}`,
    categoryId: 'video',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    isFeatured: i < 3,
    isDisplayed: true,
    rating: 4
  }))
];

const FeaturedItems = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState(sampleItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  // Filter items based on selected category and display options
  const filteredItems = items.filter(item => {
    // Filter by category
    if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
      return false;
    }
    
    // Filter by featured status if that filter is active
    if (showFeaturedOnly && !item.isFeatured) {
      return false;
    }
    
    // Hide non-displayed items unless showHidden is true
    if (!item.isDisplayed && !showHidden) {
      return false;
    }
    
    return true;
  });

  // Toggle featured status
  const toggleFeatured = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
    ));
  };

  // Toggle display status
  const toggleDisplay = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isDisplayed: !item.isDisplayed } : item
    ));
  };

  // Count featured items by category
  const featuredCounts = categories.reduce((counts, category) => {
    counts[category.id] = items.filter(item => 
      item.categoryId === category.id && item.isFeatured
    ).length;
    return counts;
  }, {} as Record<string, number>);

  // Calculate total featured items
  const totalFeatured = items.filter(item => item.isFeatured).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {t('admin.featuredItems')}
      </h1>

      <div className="p-6 bg-white rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {t('admin.displaySettings')}
        </h2>
        
        {/* Category filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.filterByCategory')}:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                activeCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.allCategories')}
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full flex items-center ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className="ml-1 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {featuredCounts[category.id]}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Display filters */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="mr-2 h-4 w-4"
            />
            <span>{t('admin.showFeaturedOnly')}</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={() => setShowHidden(!showHidden)}
              className="mr-2 h-4 w-4"
            />
            <span>{t('admin.showHiddenItems')}</span>
          </label>
        </div>
        
        {/* Stats */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
          <p>
            <span className="font-medium">{totalFeatured}</span> items are currently featured 
            {activeCategory !== 'all' ? ` (${featuredCounts[activeCategory]} in ${
              categories.find(c => c.id === activeCategory)?.name
            })` : ''}
          </p>
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className={`border rounded-lg overflow-hidden ${
              !item.isDisplayed ? 'opacity-50' : ''
            }`}
          >
            <div className="relative h-40">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`p-2 rounded-full ${
                    item.isFeatured 
                      ? 'bg-yellow-400 text-white' 
                      : 'bg-white bg-opacity-70 text-gray-600'
                  }`}
                  title={item.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star size={16} className={item.isFeatured ? 'fill-white' : ''} />
                </button>
                
                <button
                  onClick={() => toggleDisplay(item.id)}
                  className={`p-2 rounded-full ${
                    item.isDisplayed 
                      ? 'bg-white bg-opacity-70 text-blue-600' 
                      : 'bg-gray-700 text-white'
                  }`}
                  title={item.isDisplayed ? 'Hide from website' : 'Show on website'}
                >
                  {item.isDisplayed ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
              
              {/* Category badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                {categories.find(c => c.id === item.categoryId)?.name}
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium mb-1">{item.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex">
                  {Array(5).fill(null).map((_, i) => (
                    <span 
                      key={i}
                      className={`text-sm ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                {item.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-2">No items match your filters</p>
          <button 
            onClick={() => {
              setActiveCategory('all');
              setShowFeaturedOnly(false);
              setShowHidden(true);
            }}
            className="text-blue-600 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Check className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">How visibility works:</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• <strong>Featured items</strong> appear on the homepage and in featured sections</li>
              <li>• <strong>Displayed items</strong> appear in their category pages</li>
              <li>• <strong>Hidden items</strong> don't appear on the website but are saved in the database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedItems;
