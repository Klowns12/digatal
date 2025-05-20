import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Course } from '../../types';

// Sample course data
const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Item 1',
    description: 'Course description here',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 4
  },
  {
    id: '2',
    title: 'Item 3',
    description: 'Course description here',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 5
  },
  {
    id: '3',
    title: 'Item 4',
    description: 'Course description here',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 4
  },
  {
    id: '4',
    title: 'Item 11',
    description: 'Course description here',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 4
  }
];

const Courses = () => {
  const { t } = useTranslation();
  
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t('courses.title')}</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            {t('courses.viewAll')}
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sampleCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{course.title}</h3>
                <div className="flex items-center mb-4">
                  {renderRating(course.rating)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">${course.price.toFixed(2)}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                    {t('cta.readMore')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;