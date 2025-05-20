import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Course } from '../../types';
import { Trash2, Edit, Plus, Star } from 'lucide-react';

// Placeholder data
const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to e-Learning',
    description: 'Learn the fundamentals of e-learning design and development.',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 4
  },
  {
    id: '2',
    title: 'Advanced SCORM Implementation',
    description: 'Master the intricacies of SCORM and implement advanced tracking features.',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 35.00,
    rating: 5
  },
  {
    id: '3',
    title: 'Video Production for Learning',
    description: 'Learn professional techniques for creating educational videos.',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 4
  },
  {
    id: '4',
    title: 'Learning Management Systems',
    description: 'Explore different LMS platforms and learn how to manage them effectively.',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 25.00,
    rating: 4
  }
];

const CoursesAdmin = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsAdding(false);
  };
  
  const handleAdd = () => {
    setEditingCourse({
      id: `new-${Date.now()}`,
      title: 'New Course',
      description: '',
      imageUrl: '',
      price: 0,
      rating: 0
    });
    setIsAdding(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };
  
  const handleCancel = () => {
    setEditingCourse(null);
    setIsAdding(false);
  };
  
  const handleSave = () => {
    if (editingCourse) {
      if (isAdding) {
        setCourses([...courses, editingCourse]);
      } else {
        setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
      }
      setEditingCourse(null);
      setIsAdding(false);
    }
  };
  
  const handleChange = (field: keyof Course, value: string | number) => {
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [field]: value });
    }
  };
  
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.courses')}</h1>
        {!editingCourse && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {t('admin.add')}
          </button>
        )}
      </div>
      
      {!editingCourse ? (
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
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.imageUrl && (
                      <img src={course.imageUrl} alt={course.title} className="h-12 w-12 rounded-md object-cover" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${course.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderRating(course.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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
          <h2 className="text-lg font-semibold mb-6">
            {isAdding ? 'Add New Course' : 'Edit Course'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editingCourse.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editingCourse.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editingCourse.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="1"
                value={editingCourse.rating}
                onChange={(e) => handleChange('rating', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={editingCourse.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {editingCourse.imageUrl && (
                <div className="mt-2">
                  <img
                    src={editingCourse.imageUrl}
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
      )}
    </div>
  );
};

export default CoursesAdmin;