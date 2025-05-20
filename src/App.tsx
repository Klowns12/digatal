import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminContentEdit from './pages/admin/ContentEdit';
import AdminServices from './pages/admin/Services';
import AdminCourses from './pages/admin/Courses';
import AdminVideos from './pages/admin/Videos';
import AdminLogos from './pages/admin/Logos'; 
import AdminFeaturedItems from './pages/admin/FeaturedItems'; // Import the new component
import AdminImages from './pages/admin/Images';
import NotFoundPage from './pages/NotFoundPage';
import CategoryPage from './pages/CategoryPage';

// Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<AdminContentEdit />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="featured" element={<AdminFeaturedItems />} /> {/* Add the new route */}
            <Route path="logos" element={<AdminLogos />} /> 
            <Route path="images" element={<AdminImages />} />
          </Route>
          
          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;