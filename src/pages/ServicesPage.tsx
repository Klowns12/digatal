import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
}

const generateItems = (prefix: string, count: number): ServiceItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${prefix} ${i + 1}`,
    description: `Description for ${prefix} item ${i + 1} with details about the project.`
  }));
};

const serviceCategories = [
  {
    id: 'elearning',
    title: 'Customized e-Learning',
    titleThai: 'อีเลินนิ่ง (E-Learning แบบปรับแต่ง)',
    description: 'เราสร้างโซลูชัน e-Learning แบบปรับแต่งตามความต้องการเฉพาะขององค์กรของคุณ ด้วยประสบการณ์กว่า 10 ปี ในการจัดทำสื่อการเรียนการสอนรูปแบบ อีเลินนิ่ง (E-learning) ที่ครอบคลุมทุกแพลตฟอร์ม',
    descriptionEn: 'We create customized e-Learning solutions based on your organization\'s specific needs, with over 10 years of experience in developing learning materials across all platforms.',
    features: [
      'จัดทำ SCORM file (สกอมไฟล์), Tin Can และ xAPI compliant content',
      'Interactive simulations and scenario-based learning',
      'Responsive design for all devices'
    ],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    items: generateItems('e-Learning', 20)
  },
  {
    id: 'video',
    title: 'Video Production',
    titleThai: 'ออกกองถ่ายทำในรูปแบบวิดีโอ',
    description: 'Our professional video production services create engaging educational content, from instructional videos to animated explainers that simplify complex concepts and captivate your audience.',
    descriptionThai: 'บริการผลิตวิดีโอมืออาชีพของเราสร้างเนื้อหาการเรียนรู้ที่น่าสนใจ ตั้งแต่วิดีโอสอน ไปจนถึงแอนิเมชันอธิบาย',
    features: [
      'Instructional and training videos',
      '2D and 3D animation',
      'Motion graphics and visual storytelling'
    ],
    image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=2070',
    items: generateItems('Video', 20)
  },
  {
    id: '360',
    title: '360° Virtual Tours & Training',
    titleThai: '360 Matterport และ Virtual Tour & Training แบบ 360°',
    description: 'Immerse your audience in interactive 360° environments that provide realistic training scenarios and virtual tours, enhancing engagement and retention through experiential learning. Our Matterport-powered solutions create impactful learning experiences.',
    descriptionThai: 'จุ่มผู้ชมของคุณลงในสภาพแวดล้อมแบบ 360° ที่โต้ตอบได้ซึ่งให้สถานการณ์การฝึกอบรมที่สมจริง',
    features: [
      'Professional Matterport 3D facility tours with customizable features',
      'Interactive hotspots and information points with multimedia integration',
      'Immersive VR-compatible training simulations for enhanced learning retention'
    ],
    image: 'https://www.hotel-suppliers.com/wp-content/uploads/2021/11/Matterport-3-devices-scaled.jpg',
    items: generateItems('360', 20)
  },
  {
    id: 'lms',
    title: 'Learning Management System (LMS)',
    titleThai: 'ระบบจัดการการเรียนรู้ (LMS)',
    description: 'Our custom LMS solutions provide a centralized platform for delivering, tracking, and managing all your learning initiatives, with intuitive interfaces designed for both administrators and learners. Get powerful analytics to measure the effectiveness of your training programs.',
    descriptionThai: 'โซลูชัน LMS แบบกำหนดเองของเราให้แพลตฟอร์มศูนย์กลางสำหรับการจัดส่ง ติดตาม และจัดการแผนการเรียนรู้ทั้งหมด',
    features: [
      'Custom LMS development and integration',
      'Comprehensive learning analytics',
      'Gamification and social learning features'
    ],
    image: 'https://images.unsplash.com/photo-1569017388730-020b5f80a004?auto=format&fit=crop&q=80&w=2070',
    items: generateItems('LMS', 20)
  },
  {
    id: 'web',
    title: 'Web Design & Development',
    titleThai: 'ออกแบบและพัฒนาเว็บไซต์',
    description: 'We create modern, responsive websites optimized for user experience and conversions, whether you need a simple informational site or a complex web application with custom functionality.',
    descriptionThai: 'เราสร้างเว็บไซต์ที่ทันสมัย ตอบสนองความต้องการ และเหมาะสมสำหรับประสบการณ์การใช้งานและการแปลง',
    features: [
      'Responsive website design',
      'Custom web applications',
      'CMS implementation and customization'
    ],
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=2070',
    items: generateItems('Web', 20)
  }
];

const ServicesPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLanguage = i18n.language;
  const isThaiLanguage = currentLanguage === 'th';
  const hash = location.hash.replace('#', '');

  return (
    <div className="pt-8 pb-16">
      <main className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {isThaiLanguage ? 'บริการของเรา' : 'Our Learning & Development Services'}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {isThaiLanguage
                ? 'เราให้บริการโซลูชันการเรียนรู้ดิจิทัลที่ครอบคลุมและปรับแต่งตามความต้องการเฉพาะของคุณ บริการ e-Learning ผลิตวิดีโอ และระบบ LMS ของเราช่วยให้องค์กรปรับเปลี่ยนโปรแกรมการฝึกอบรม'
                : 'We provide comprehensive digital learning solutions tailored to your specific needs. Our e-Learning, video production, and LMS services help organizations transform their training programs.'}
            </p>
          </div>

          {/* Services Grid */}
          <div className="space-y-16">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                {/* Text content - alternates between left and right */}
                <div className={index % 2 === 0 ? "md:order-1" : "md:order-2"}>
                  <h2 className="text-3xl font-bold mb-4">
                    {currentLanguage === 'en' ? category.title : category.titleThai}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {currentLanguage === 'en' 
                      ? (category.descriptionEn || category.description) 
                      : (category.descriptionThai || category.description)}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/#${category.id}`}
                    className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    {isThaiLanguage ? 'ดูตัวอย่าง' : 'Explore Examples'}
                  </Link>
                </div>
                
                {/* Image section - alternates between left and right */}
                <div className={index % 2 === 0 ? "md:order-2" : "md:order-1"}>
                  <img 
                    src={category.image} 
                    alt={currentLanguage === 'en' ? category.title : category.titleThai} 
                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                    style={{ aspectRatio: "16/9" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-8 mt-16 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              {isThaiLanguage 
                ? 'พร้อมที่จะเปลี่ยนแปลงประสบการณ์การเรียนรู้ของคุณ?' 
                : 'Ready to transform your learning experience?'}
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              {isThaiLanguage
                ? 'ติดต่อเราวันนี้เพื่อขอคำปรึกษาฟรีเกี่ยวกับวิธีที่เราสามารถช่วยคุณให้บรรลุเป้าหมายทางการศึกษา'
                : 'Contact us today for a free consultation on how we can help you achieve your educational goals.'}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition text-lg"
            >
              {isThaiLanguage ? 'เริ่มต้นใช้งาน' : 'Get Started'}
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;