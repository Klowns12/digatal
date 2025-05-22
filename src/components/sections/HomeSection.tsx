import { useEffect, useState } from 'react';
import { getFeaturedContentByCategory } from '../../services/homepageService';
import { categoryLabels } from '../../utils/constants'; // Assuming you have category labels in a constants file

const HomeSection = () => {
  const [featuredContent, setFeaturedContent] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const loadFeaturedContent = async () => {
      // โหลดเนื้อหาที่ถูกเลือกสำหรับแต่ละหมวดหมู่
      const categories = ['elearning', 'video', '360', 'lms', 'web'];
      const content: Record<string, any> = {};
      
      for (const categoryId of categories) {
        const categoryContent = await getFeaturedContentByCategory(categoryId);
        content[categoryId] = categoryContent;
      }
      
      setFeaturedContent(content);
    };
    
    loadFeaturedContent();
    
    // อัพเดตเมื่อมีการเปลี่ยนแปลงสถานะ featured
    window.addEventListener('video-featured-changed', loadFeaturedContent);
    
    return () => {
      window.removeEventListener('video-featured-changed', loadFeaturedContent);
    };
  }, []);
  
  return (
    <div>
      {/* แสดงวิดีโอที่ถูกเลือกในแต่ละหมวดหมู่ */}
      {Object.entries(featuredContent).map(([categoryId, content]) => (
        <div key={categoryId} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{categoryLabels[categoryId]}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content?.videos?.map((video: Video) => (
              <div key={video.id} className="rounded-lg overflow-hidden shadow-lg">
                <div className="relative pb-[56.25%]">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSection;