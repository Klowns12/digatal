import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactFormData } from '../../types';
import { Check } from 'lucide-react';

const ContactForm = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    // Simulate sending to backend with a delay
    try {
      // Show loading state via isSubmitting from react-hook-form
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(data);
      
      // Show success message
      setShowSuccess(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <section className="py-16 bg-gray-50 relative">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 blur-sm"></div>
      <div className="absolute top-10 right-40 w-16 h-16 bg-purple-500 rounded-full opacity-20 blur-sm"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-sm"></div>
      <div className="absolute bottom-40 left-10 w-16 h-16 bg-orange-300 rounded-full opacity-20 blur-sm"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:pr-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-1 bg-orange-300 mr-4"></div>
              <span className="text-gray-500 font-medium">Contact</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Have questions about our services? Need a personalized solution for your business? 
              We're here to help. Contact us today and our team will get back to you promptly.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-orange-50 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 uppercase tracking-wider text-xs font-semibold mb-1">
                    EMAIL
                  </h3>
                  <p className="text-gray-800 font-medium">digitalnovabkk@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-50 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 uppercase tracking-wider text-xs font-semibold mb-1">
                    PHONE
                  </h3>
                  <p className="text-gray-800 font-medium">061-7829351</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right column - Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-8 shadow-md relative">
              {/* Success message overlay */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-white bg-opacity-95 z-10 flex flex-col items-center justify-center rounded-lg"
                  >
                    <div className="bg-green-100 rounded-full p-3 mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 text-center max-w-xs">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className={`w-full px-4 py-3 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.name ? 'border-red-400' : 'border-gray-200'
                    }`}
                    {...register('name', { required: true })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">Please enter your name</p>
                  )}
                </div>
                
                <div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className={`w-full px-4 py-3 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                    {...register('email', { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                    })}
                  />
                  {errors.email?.type === 'required' && (
                    <p className="mt-1 text-sm text-red-500">Please enter your email</p>
                  )}
                  {errors.email?.type === 'pattern' && (
                    <p className="mt-1 text-sm text-red-500">Please enter a valid email</p>
                  )}
                </div>
                
                <div>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Your message"
                    className={`w-full px-4 py-3 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.message ? 'border-red-400' : 'border-gray-200'
                    }`}
                    {...register('message', { required: true })}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">Please enter your message</p>
                  )}
                </div>
                
                <div className="text-right">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;