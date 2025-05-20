import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, Video, Image, LogOut, Menu, X, Film, Award, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: t('admin.dashboard'), icon: <LayoutDashboard size={20} /> },
    { path: '/admin/content', label: t('admin.content'), icon: <FileText size={20} /> },
    { path: '/admin/services', label: t('admin.services'), icon: <Video size={20} /> },
    { path: '/admin/courses', label: t('admin.courses'), icon: <FileText size={20} /> },
    { path: '/admin/videos', label: t('admin.videos'), icon: <Film size={20} /> },
    { path: '/admin/featured', label: t('admin.featuredItems'), icon: <Star size={20} /> }, // Add featured items
    { path: '/admin/logos', label: t('admin.logos'), icon: <Award size={20} /> },
    { path: '/admin/images', label: t('admin.images'), icon: <Image size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 z-30 w-full bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">DSN Admin</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar for mobile (overlay) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 h-full w-64 bg-white border-r transition-transform duration-300 ease-in-out z-30 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <span className="font-bold text-lg">DSN Admin</span>
          </div>
          
          <nav className="p-4 flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;