export const serviceCategories = [
  {
    id: 'elearning',
    title: 'Customized e-Learning',
    titleThai: 'จัดทำหลักสูตรในรูปแบบที่ลูกค้าต้องการ',
    description: 'เราสร้างโซลูชัน e-Learning แบบปรับแต่งตามความต้องการเฉพาะขององค์กรของคุณ',
    descriptionEn: 'We create customized e-Learning solutions based on your organization\'s specific needs.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `e-Learning Project ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4,
      isOnHomepage: i < 4 // Default first 4 items to be on homepage
    }))
  },
  {
    id: 'video',
    title: 'Video Production',
    titleThai: 'ออกกองถ่ายทำในรูปแบบวิดีโอ',
    description: 'บริการผลิตวิดีโอมืออาชีพของเราสร้างเนื้อหาการเรียนรู้ที่น่าสนใจ',
    descriptionEn: 'Our professional video production services create engaging educational content.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Video Project ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4,
      isOnHomepage: i < 4
    }))
  },
  {
    id: '360',
    title: '360 Matterport and 360 Virtual Tour & Training',
    titleThai: '360 Matterport และ Virtual Tour & Training แบบ 360°',
    description: 'จุ่มผู้ชมของคุณลงในสภาพแวดล้อมแบบ 360° ที่โต้ตอบได้',
    descriptionEn: 'Immerse your audience in interactive 360° environments.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `360° Tour ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4,
      isOnHomepage: i < 4
    }))
  },
  {
    id: 'lms',
    title: 'Learning Management System (LMS)',
    titleThai: 'ระบบจัดการการเรียนรู้ (LMS)',
    description: 'โซลูชัน LMS แบบกำหนดเองของเราให้แพลตฟอร์มศูนย์กลางสำหรับการจัดส่ง',
    descriptionEn: 'Our custom LMS solutions provide a centralized platform for delivering content.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `LMS Solution ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4,
      isOnHomepage: i < 4
    }))
  },
  {
    id: 'web',
    title: 'Web Design & Development',
    titleThai: 'ออกแบบและพัฒนาเว็บไซต์',
    description: 'เราสร้างเว็บไซต์ที่ทันสมัย ตอบสนองความต้องการ',
    descriptionEn: 'We create modern, responsive websites optimized for user experience.',
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Web Project ${i + 1}`,
      price: 25.0,
      rating: 4,
      youtubeUrl: i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      isDisplayed: true,
      isFeatured: i < 4,
      isOnHomepage: i < 4
    }))
  }
];
