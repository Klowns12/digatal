import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Change language handler
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/imags/logo.png" 
              alt="Digital Nova Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/about' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/services" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/services' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {t('nav.services')}
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {t('nav.contact')}
            </Link>
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <Globe size={16} className="mr-1" />
              {i18n.language === 'en' ? 'TH' : 'EN'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-4 z-50">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/about' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/services" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/services' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.services')}
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <button 
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <Globe size={16} className="mr-1" />
                {i18n.language === 'en' ? 'TH' : 'EN'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;