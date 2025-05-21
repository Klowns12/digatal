import React from 'react';
import { useTranslation } from 'react-i18next';
import { PencilIcon, ImageIcon, BookOpenIcon, UserIcon, Film, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  
  const stats = [
    { name: 'Pages', count: 5, icon: <PencilIcon size={24} />, link: '/admin/content' },
    { name: 'Services', count: 4, icon: <BookOpenIcon size={24} />, link: '/admin/services' },
    { name: 'Videos', count: 5, icon: <Film size={24} />, link: '/admin/videos' },
    { name: 'Featured', count: 12, icon: <Star size={24} />, link: '/admin/featured' }, // Add Featured stat
    { name: 'Logos', count: 6, icon: <Award size={24} />, link: '/admin/logos' },
    { name: 'Images', count: 12, icon: <ImageIcon size={24} />, link: '/admin/images' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-md flex flex-col items-center justify-center text-center"
              >
                <div className="mb-2">{stat.icon}</div>
                <span className="text-sm font-medium">{stat.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="text-sm">You updated homepage content</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="border-b pb-3">
              <p className="text-sm">You added a new service</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
            <div className="border-b pb-3">
              <p className="text-sm">You uploaded 3 new images</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;