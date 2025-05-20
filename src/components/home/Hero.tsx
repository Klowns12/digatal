import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '../../types';
import { getActiveLogos } from '../../services/logoService';

// Initial logos - this would later be replaced with data from an API or context
const initialLogos: Logo[] = [
  {
    id: '1',
    name: 'Client Logo 1',
    imageUrl: '/imags/client-logo1.png',
    active: true,
    order: 1,
    uploadedAt: '2023-05-15'
  },
  {
    id: '2',
    name: 'Client Logo 2',
    imageUrl: '/imags/client-logo2.png',
    active: true,
    order: 2,
    uploadedAt: '2023-05-15'
  },
  {
    id: '3',
    name: 'Client Logo 3',
    imageUrl: '/imags/client-logo3.png',
    active: true,
    order: 3,
    uploadedAt: '2023-05-16'
  },
  {
    id: '4',
    name: 'Client Logo 4',
    imageUrl: '/imags/client-logo4.png',
    active: true,
    order: 4,
    uploadedAt: '2023-05-16'
  },
  {
    id: '5',
    name: 'Client Logo 5',
    imageUrl: '/imags/client-logo5.png',
    active: true,
    order: 5,
    uploadedAt: '2023-05-17'
  },
  {
    id: '6',
    name: 'Client Logo 6',
    imageUrl: '/imags/client-logo6.png',
    active: true,
    order: 6,
    uploadedAt: '2023-05-17'
  }
];

const Hero = () => {
  const { t } = useTranslation();
  const [logos, setLogos] = useState<Logo[]>(initialLogos);

  useEffect(() => {
    // Load active logos
    const loadLogos = () => {
      const activeLogos = getActiveLogos();
      setLogos(activeLogos);
    };
    
    // Initial load
    loadLogos();
    
    // Listen for updates from admin
    const handleLogosUpdated = () => loadLogos();
    window.addEventListener('logos-updated', handleLogosUpdated);
    
    return () => {
      window.removeEventListener('logos-updated', handleLogosUpdated);
    };
  }, []);

  // Get logo image URLs in correct order
  const logoUrls = logos.map(logo => logo.imageUrl);
  
  return (
    <section className="relative pt-16 pb-0 md:pb-1 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="md:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <div className="inline-block">
                  <div className="flex items-center px-3 py-1 text-orange-500 rounded-full bg-orange-50 mb-4">
                    <span className="h-2 w-2 bg-orange-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">{t('header.subtitle')}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t('hero.description')}
              </p>
            </motion.div>
          </div>
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative max-w-md mx-auto md:max-w-sm md:mx-0"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-yellow-400 rounded-full opacity-60 blur-sm"></div>
              <div className="absolute -bottom-4 right-12 w-14 h-14 bg-red-300 rounded-full opacity-60 blur-sm"></div>
              <div className="absolute bottom-12 -right-6 w-16 h-16 bg-blue-500 rounded-full opacity-60 blur-sm"></div>
              <div className="absolute -top-6 right-12 w-12 h-12 bg-purple-500 rounded-full opacity-60 blur-sm"></div>
              
              {/* Organic Blob Illustration */}
              <div className="relative z-10 w-full p-5">
                {/* Blob background */}
                <div className="absolute inset-0 z-0">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path 
                      fill="#4338ca" 
                      d="M44.2,-76.1C55.9,-69.1,63.5,-53.7,69.3,-38.7C75.2,-23.7,79.2,-9.2,78.8,5.2C78.5,19.7,73.7,34.1,65,45.8C56.4,57.5,43.8,66.6,30.1,71.7C16.4,76.9,1.7,78.2,-13.3,76.9C-28.3,75.6,-43.6,71.8,-55.3,63C-67.1,54.2,-75.3,40.4,-80.5,25.2C-85.7,10,-87.9,-6.6,-84.1,-22.1C-80.3,-37.7,-70.5,-52.3,-57.1,-59.5C-43.8,-66.6,-26.9,-66.5,-10.9,-68.8C5.1,-71.1,20.2,-75.7,32.4,-76C44.7,-76.3,54,-83.1,44.2,-76.1Z" 
                      transform="translate(100 100)" 
                    />
                  </svg>
                </div>
                
                <div className="relative flex justify-center items-center z-10">
                  {/* Main content container */}
                  <div className="relative">
                    {/* Main blob-shaped image */}
                    <div 
                      className="w-full overflow-hidden relative shadow-lg"
                      style={{
                        width: '280px',
                        height: '280px',
                        borderRadius: '70% 30% 50% 50% / 50% 60% 40% 50%'
                      }}
                    >
                      <img 
                        src="/imags/2.png" 
                        alt="Digital Learning Interface" 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Soft glowing accent */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
                    </div>
                    
                    {/* Secondary blob-shaped image */}
                    <div 
                      className="absolute overflow-hidden border-4 border-white shadow-lg z-20"
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '60% 40% 50% 50% / 40% 50% 60% 60%',
                        bottom: '-30px',
                        right: '-40px'
                      }}
                    >
                      <img 
                        src="/imags/1.png"
                        alt="Secondary Learning Image" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Decorative blob elements */}
                <div 
                  className="absolute bg-yellow-400 opacity-70 blur-sm"
                  style={{
                    width: '80px',
                    height: '60px',
                    borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
                    top: '-20px',
                    left: '-10px',
                    zIndex: '5'
                  }}
                ></div>
                <div 
                  className="absolute bg-blue-500 opacity-70 blur-sm"
                  style={{
                    width: '60px',
                    height: '80px',
                    borderRadius: '40% 60% 70% 30% / 50% 50% 50% 60%',
                    bottom: '30px',
                    right: '-15px',
                    zIndex: '5'
                  }}
                ></div>
                <div 
                  className="absolute bg-pink-400 opacity-70 blur-sm"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50% 50% 50% 50% / 60% 40% 60% 40%',
                    top: '40px',
                    right: '20px',
                    zIndex: '5'
                  }}
                ></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Logo Slider Loop */}
      <div className="w-full mt-12 mb-0">
        <div className="relative overflow-hidden bg-[#f8f9fa] py-3 shadow-sm">
          <div className="relative py-3">
            <div className="overflow-hidden">
              {logoUrls.length > 0 ? (
                <motion.div 
                  className="flex flex-nowrap whitespace-nowrap"
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      duration: 30,
                      ease: "linear",
                    },
                  }}
                >
                  {/* Only render each logo once - removed duplicate rendering */}
                  {logoUrls.map((logoUrl, index) => (
                    <div 
                      key={`logo-${index}`}
                      className="flex-none inline-flex items-center justify-center mx-10"
                    >
                      <img 
                        src={logoUrl} 
                        alt={`Client logo ${index + 1}`}
                        className="h-[60px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="px-10 text-gray-400">No client logos available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;