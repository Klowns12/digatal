import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ContentBlock } from '../../types';
import { Link } from 'react-router-dom';
import { Home, Menu, Settings, Book, Video, Image, Layout, Check, Globe, FileText } from 'lucide-react';

// Placeholder data
const initialContent: ContentBlock[] = [
  {
    id: '1',
    title: 'Hero Section',
    titleThai: 'ส่วนหัวข้อหลัก',
    content: '<h1>Divi Tutoring School of San Francisco</h1><p>Specializing in creating e-learning media in online form (e-Learning) and providing teaching systems like SCORM (offline), Tincan, xAPI, rise 360, 360 Training, infographics, animation including video production and LMS systems</p>',
    contentThai: '<h1>Divi Tutoring School of San Francisco</h1><p>เราชำนาญในการจัดทำสื่อการเรียนการสอนในรูปแบบออนไลน์ (อีเลิร์นนิ่ง, E-learning) และจัดทำให้ได้ตามหลักมาตรฐาน เช่น SCORM (จัดทำแบบออฟไลน์), Tincan, xAPI รวมถึง video production, infographics, animation และระบบ LMS ครบวงจร</p>',
    imageUrl: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    section: 'home'
  },
  {
    id: '2',
    title: 'About Us',
    titleThai: 'เกี่ยวกับเรา',
    content: '<p>We are experts in creating e-learning content and solutions for businesses and educational institutions.</p>',
    contentThai: '<p>เรามีความเชี่ยวชาญในการสร้างเนื้อหาและโซลูชั่น e-learning สำหรับธุรกิจและสถาบันการศึกษา</p>',
    section: 'about'
  },
  {
    id: '3',
    title: 'Contact Information',
    titleThai: 'ข้อมูลติดต่อ',
    content: '<p>Email: contact@digitalnova.com</p><p>Phone: +66 12 345 6789</p>',
    contentThai: '<p>อีเมล: contact@digitalnova.com</p><p>โทรศัพท์: +66 12 345 6789</p>',
    section: 'contact'
  }
];

// Add admin section navigation
const adminSections = [
  { id: 'content', label: 'เนื้อหาเว็บไซต์', icon: FileText },
  { id: 'services', label: 'บริการ', icon: Settings },
  { id: 'courses', label: 'คอร์สเรียน', icon: Book },
  { id: 'videos', label: 'วิดีโอ', icon: Video },
  { id: 'images', label: 'รูปภาพ', icon: Image }
];

// Add page sections for management
const websitePages = [
  { id: 'home', label: 'หน้าหลัก', sections: ['hero', 'features', 'services', 'cta'] },
  { id: 'about', label: 'เกี่ยวกับเรา', sections: ['team', 'history', 'mission'] },
  { id: 'services', label: 'บริการ', sections: ['header', 'elearning', 'video', '360', 'lms', 'web'] },
  { id: 'contact', label: 'ติดต่อเรา', sections: ['form', 'map', 'info'] }
];

const ContentEdit = () => {
  const { t } = useTranslation();
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(initialContent);
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
  const [activeTab, setActiveTab] = useState<'english' | 'thai'>('english');
  const [activePage, setActivePage] = useState<string>('home');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleEdit = (content: ContentBlock) => {
    setEditingContent(content);
  };
  
  const handleCancel = () => {
    setEditingContent(null);
  };
  
  const handleSave = () => {
    if (editingContent) {
      setContentBlocks(contentBlocks.map(block => 
        block.id === editingContent.id ? editingContent : block
      ));
      setEditingContent(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  const handleContentChange = (value: string) => {
    if (editingContent) {
      if (activeTab === 'english') {
        setEditingContent({ ...editingContent, content: value });
      } else {
        setEditingContent({ ...editingContent, contentThai: value });
      }
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingContent) {
      if (activeTab === 'english') {
        setEditingContent({ ...editingContent, title: e.target.value });
      } else {
        setEditingContent({ ...editingContent, titleThai: e.target.value });
      }
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingContent && e.target.value) {
      setEditingContent({ ...editingContent, imageUrl: e.target.value });
    }
  };
  
  const filteredContent = contentBlocks.filter(block => block.section.startsWith(activePage));
  
  return (
    <div>
      {/* Admin Navigation */}
      <div className="bg-white shadow-sm rounded-lg mb-6 overflow-x-auto">
        <div className="flex p-1">
          {adminSections.map(section => (
            <Link 
              key={section.id}
              to={`/admin/${section.id}`}
              className={`px-4 py-3 flex items-center whitespace-nowrap rounded-md mx-1 ${
                section.id === 'content' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon size={18} className="mr-2" />
              {section.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.content')}</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 mr-1">หน้า:</span>
          <div className="flex space-x-2 bg-gray-100 rounded-md p-1">
            {websitePages.map(page => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`px-3 py-1 text-sm rounded-md ${
                  activePage === page.id 
                    ? 'bg-white shadow-sm text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-4">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <p>บันทึกการเปลี่ยนแปลงแล้ว</p>
        </div>
      )}

      {!editingContent ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="font-semibold text-lg flex items-center">
              <Layout className="h-5 w-5 mr-2 text-blue-600" />
              {websitePages.find(page => page.id === activePage)?.label || 'เนื้อหาทั้งหมด'}
            </h2>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ส่วน
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หัวข้อ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รูปภาพ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((block) => (
                <tr key={block.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {block.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {block.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {block.imageUrl && (
                      <img src={block.imageUrl} alt={block.title} className="h-10 w-10 rounded-md object-cover" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(block)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {t('admin.edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Editing: {activeTab === 'english' ? editingContent.title : editingContent.titleThai}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('english')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'english'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveTab('thai')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'thai'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Thai
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={activeTab === 'english' ? editingContent.title : editingContent.titleThai}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <div className="h-64">
                <ReactQuill
                  theme="snow"
                  value={activeTab === 'english' ? editingContent.content : editingContent.contentThai}
                  onChange={handleContentChange}
                  className="h-full"
                />
              </div>
            </div>
            
            {editingContent.imageUrl !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingContent.imageUrl || ''}
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {editingContent.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editingContent.imageUrl}
                      alt="Preview"
                      className="h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('admin.save')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* SEO Settings Section */}
      {activePage && !editingContent && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Globe className="mr-2 text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">SEO การตั้งค่าสำหรับหน้า {websitePages.find(page => page.id === activePage)?.label}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหน้า (Page Title)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                placeholder="ชื่อเว็บไซต์ | ชื่อหน้า"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายเมต้า (Meta Description)</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                rows={3}
                placeholder="ใส่คำอธิบายเว็บไซต์สั้นๆไม่เกิน 160 ตัวอักษร"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">ควรมีความยาวไม่เกิน 160 ตัวอักษร</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คีย์เวิร์ด (Meta Keywords)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                placeholder="คีย์เวิร์ด1, คีย์เวิร์ด2, คีย์เวิร์ด3"
              />
              <p className="text-xs text-gray-500 mt-1">คั่นด้วยเครื่องหมายจุลภาค (,)</p>
            </div>
            
            <div className="pt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                บันทึกการตั้งค่า SEO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEdit;