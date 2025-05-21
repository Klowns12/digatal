import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactForm from '../components/contact/ContactForm';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { getLocation, generateEmbedMapUrl } from '../services/locationService';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isThaiLanguage = i18n.language === 'th';
  const [location, setLocation] = useState(getLocation());
  
  useEffect(() => {
    const handleLocationUpdate = () => {
      setLocation(getLocation());
    };
    
    window.addEventListener('location-updated', handleLocationUpdate);
    return () => window.removeEventListener('location-updated', handleLocationUpdate);
  }, []);

  return (
    <div className="pt-8 pb-16">
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isThaiLanguage ? 'ติดต่อเรา' : 'Contact Us'}
        </h1>
        <div className="w-24 h-1 bg-blue-600"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isThaiLanguage ? 'ข้อมูลการติดต่อ' : 'Get in Touch'}
              </h2>
              <p className="text-gray-600 mb-8">
                {isThaiLanguage 
                  ? 'หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติมเกี่ยวกับบริการของเรา โปรดติดต่อเราผ่านช่องทางด้านล่างนี้ เรายินดีให้คำปรึกษาและช่วยเหลือคุณ'
                  : 'If you have questions or need more information about our services, please contact us through the channels below. We\'re here to help and provide you with the information you need.'}
              </p>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {isThaiLanguage ? 'ที่อยู่' : 'Address'}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {isThaiLanguage ? location.address.th : location.address.en}
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {isThaiLanguage ? 'โทรศัพท์' : 'Phone'}
                    </h3>
                    <p className="text-gray-600">+66 2 123 4567</p>
                    <p className="text-gray-600">+66 81 234 5678 (Mobile)</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {isThaiLanguage ? 'อีเมล' : 'Email'}
                    </h3>
                    <p className="text-gray-600">digitalnovabkk@gmail.com</p>
                  </div>
                </div>
                
                {/* Office Hours */}
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {isThaiLanguage ? 'เวลาทำการ' : 'Office Hours'}
                    </h3>
                    <p className="text-gray-600">
                      {isThaiLanguage ? 'วันจันทร์ - วันศุกร์: 9:00 - 18:00 น.' : 'Monday - Friday: 9:00 AM - 6:00 PM'}
                    </p>
                    <p className="text-gray-600">
                      {isThaiLanguage ? 'วันเสาร์ - อาทิตย์: ปิดทำการ' : 'Saturday - Sunday: Closed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isThaiLanguage ? 'แผนที่และตำแหน่งที่ตั้ง' : 'Location'}
                </h2>
                <a 
                  href={location.googleMapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 flex items-center text-sm hover:underline"
                >
                  {isThaiLanguage ? 'ดูแผนที่ขนาดใหญ่' : 'View Larger Map'}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe 
                  src={generateEmbedMapUrl(location.latitude, location.longitude, location.zoom)}
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  title="Office Location Map"
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="mt-4 text-gray-600">
                <p className="whitespace-pre-line">
                  {isThaiLanguage ? location.address.th : location.address.en}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isThaiLanguage ? 'ส่งข้อความถึงเรา' : 'Send Us a Message'}
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;