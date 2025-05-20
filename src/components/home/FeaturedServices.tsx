import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { serviceCategories } from '../../data/serviceCategories';

const FeaturedServices = () => {
  const { i18n } = useTranslation();
  const isThaiLanguage = i18n.language === 'th';
  
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
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {isThaiLanguage ? 'บริการของเรา' : 'Our Services'}
        </h2>
        
        {/* Display each category with up to 4 featured items */}
        {serviceCategories.map(category => {
          // Get only items marked for homepage display (max 4)
          const homepageItems = category.items
            .filter(item => item.isOnHomepage)
            .slice(0, 4);
            
          if (homepageItems.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                  <p className="text-gray-600">{category.titleThai}</p>
                </div>
                <Link 
                  to={`/category/${category.id}`} 
                  className="text-blue-600 hover:underline"
                >
                  {isThaiLanguage ? 'ดูทั้งหมด' : 'View All'} →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {homepageItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      
                      {item.youtubeUrl && (
                        <Link 
                          to={`/category/${category.id}`}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                        >
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Play size={24} className="text-blue-600 ml-1" />
                          </div>
                        </Link>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                      <div className="flex items-center justify-between">
                        <div>{renderRating(item.rating)}</div>
                        <span className="text-gray-900 font-medium">฿{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedServices;
