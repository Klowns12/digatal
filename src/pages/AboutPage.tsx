import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="pt-8">
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.about')}</h1>
        <div className="w-24 h-1 bg-blue-600"></div>
      </div>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Digital Nova Co., Ltd. (DSN) is a leading e-learning content provider specializing in creating custom e-learning solutions for businesses and educational institutions. Founded in 2015, we have helped hundreds of organizations transform their training and educational programs.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of instructional designers, multimedia specialists, and education experts work together to create engaging, effective learning experiences that help our clients achieve their goals.
              </p>
              <p className="text-gray-600">
                We provide a wide range of services including e-learning content development, video production, SCORM packages, learning management systems, and more.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-300 rounded-full opacity-40 blur-md"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-500 rounded-full opacity-40 blur-md"></div>
              
              {/* Main Image */}
              <div className="relative z-10 overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Our Team"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe that effective learning experiences should be engaging, interactive, and tailored to the specific needs of each organization and learner.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Customized Solutions',
                description: 'We create tailored learning solutions that address your specific challenges and objectives.'
              },
              {
                title: 'Engaging Content',
                description: 'Our interactive, multimedia content keeps learners engaged and improves knowledge retention.'
              },
              {
                title: 'Measurable Results',
                description: 'We provide robust analytics and reporting to track progress and demonstrate ROI.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-blue-600">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;