import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ExternalLink, X } from 'lucide-react';
import { getLocation, generateEmbedMapUrl } from '../services/locationService';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isThaiLanguage = i18n.language === 'th';
  const [location, setLocation] = useState(getLocation());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleLocationUpdate = () => {
      setLocation(getLocation());
    };
    
    window.addEventListener('location-updated', handleLocationUpdate);
    return () => window.removeEventListener('location-updated', handleLocationUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // TODO: Implement actual email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormStatus('success');
    
    setTimeout(() => {
      setFormStatus('idle');
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        {/* Contact Info Section */}
        <div className="max-w-6xl mx-auto bg-gray-50 rounded-3xl p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left Column - Contact Details */}
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-6 items-start">
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium text-lg mb-2">
                    {isThaiLanguage ? 'ที่อยู่' : 'Address'}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {isThaiLanguage ? location.address.th : location.address.en}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-6 items-start">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium text-lg mb-2">
                    {isThaiLanguage ? 'โทรศัพท์' : 'Phone'}
                  </h3>
                  <p className="text-gray-600 text-base">+66 2 123 4567</p>
                  <p className="text-gray-600 text-base">+66 81 234 5678</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-6 items-start">
                <div className="bg-purple-100 p-4 rounded-2xl">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium text-lg mb-2">
                    {isThaiLanguage ? 'อีเมล' : 'Email'}
                  </h3>
                  <p className="text-gray-600 text-base">digitalnovabkk@gmail.com</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex gap-6 items-start">
                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium text-lg mb-2">
                    {isThaiLanguage ? 'เวลาทำการ' : 'Office Hours'}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {isThaiLanguage ? 'จันทร์ - ศุกร์: 9:00 - 18:00 น.' : 'Mon - Fri: 9:00 AM - 6:00 PM'}
                  </p>
                  <p className="text-gray-600 text-base">
                    {isThaiLanguage ? 'เสาร์ - อาทิตย์: ปิดทำการ' : 'Sat - Sun: Closed'}
                  </p>
                </div>
              </div>

              {/* Message Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-2xl hover:bg-blue-700 transition-colors text-lg"
              >
                <Mail className="h-6 w-6" />
                <span>{isThaiLanguage ? 'ส่งข้อความ' : 'Send Message'}</span>
              </button>
            </div>

            {/* Right Column - Map */}
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isThaiLanguage ? 'ตำแหน่งที่ตั้ง' : 'Location'}
                </h2>
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-base hover:text-blue-700 flex items-center gap-2"
                >
                  <span>{isThaiLanguage ? 'ดูใน Google Maps' : 'View in Google Maps'}</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden h-[400px] shadow-lg">
                <iframe
                  src={generateEmbedMapUrl(location.latitude, location.longitude, location.zoom)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Office Location Map"
                />
              </div>
              <p className="text-base text-gray-500 mt-4">
                {isThaiLanguage ? 'ใช้ ctrl + scroll เพื่อซูมแผนที่' : 'Use ctrl + scroll to zoom the map'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* แยก Modal ออกมาและปรับ z-index */}
      {isModalOpen && (
        <div className="relative">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsModalOpen(false)} 
            style={{ zIndex: 9999 }}
          />
          <div 
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {isThaiLanguage ? 'ส่งข้อความถึงเรา' : 'Send us a message'}
                  </h3>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isThaiLanguage ? 'ชื่อ' : 'Name'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isThaiLanguage ? 'อีเมล' : 'Email'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isThaiLanguage ? 'หัวข้อ' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isThaiLanguage ? 'ข้อความ' : 'Message'}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 border rounded-xl hover:bg-gray-50"
                    >
                      {isThaiLanguage ? 'ยกเลิก' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {formStatus === 'sending' 
                        ? (isThaiLanguage ? 'กำลังส่ง...' : 'Sending...')
                        : (isThaiLanguage ? 'ส่งข้อความ' : 'Send Message')}
                    </button>
                  </div>

                  {formStatus === 'success' && (
                    <div className="text-green-600 text-center p-4 bg-green-50 rounded-xl">
                      {isThaiLanguage ? 'ส่งข้อความเรียบร้อยแล้ว' : 'Message sent successfully!'}
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="text-red-600 text-center p-4 bg-red-50 rounded-xl">
                      {isThaiLanguage ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'An error occurred. Please try again.'}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;