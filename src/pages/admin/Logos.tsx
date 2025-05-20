import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, ArrowUp, ArrowDown, EyeOff, Eye, Info } from 'lucide-react';
import { Logo } from '../../types';
import { 
  getLogos, 
  addLogo, 
  toggleLogoActive, 
  moveLogoUp, 
  moveLogoDown, 
  deleteLogo 
} from '../../services/logoService';

const LogosAdmin = () => {
  const { t } = useTranslation();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  
  // Load logos on component mount and whenever they change
  const loadLogos = () => {
    const currentLogos = getLogos();
    setLogos(currentLogos);
  };
  
  useEffect(() => {
    loadLogos();
    
    // Listen for updates from other components or browser tabs
    window.addEventListener('logos-updated', loadLogos);
    return () => window.removeEventListener('logos-updated', loadLogos);
  }, []);

  // Move logo up in order
  const handleMoveUp = (id: string) => {
    moveLogoUp(id);
    loadLogos(); // Reload to reflect changes
  };

  // Move logo down in order
  const handleMoveDown = (id: string) => {
    moveLogoDown(id);
    loadLogos(); // Reload to reflect changes
  };

  // Toggle logo visibility
  const handleToggleActive = (id: string) => {
    toggleLogoActive(id);
    loadLogos(); // Reload to reflect changes
  };

  // Delete logo
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this logo?')) {
      deleteLogo(id);
      loadLogos(); // Reload to reflect changes
    }
  };

  // Add new logo
  const handleAddLogo = () => {
    if (newLogoName && newLogoUrl) {
      addLogo({
        name: newLogoName,
        imageUrl: newLogoUrl,
        active: true
      });
      
      // Reset form fields
      setNewLogoName('');
      setNewLogoUrl('');
      
      // Reload logos to include the new one
      loadLogos();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.logos')}</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <Info size={20} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-blue-800 font-medium mb-1">การจัดการโลโก้</h3>
            <p className="text-blue-700 text-sm">
              โลโก้ที่เพิ่มจะแสดงในสไลเดอร์ของหน้าหลักตามลำดับที่กำหนด คุณสามารถปรับเปลี่ยนลำดับการแสดงผล 
              เปิด/ปิดการแสดง หรือลบโลโก้ได้ โดยการเปลี่ยนแปลงทั้งหมดจะปรากฏบนหน้าเว็บไซต์ทันที
            </p>
          </div>
        </div>
      </div>
      
      {/* Add new logo section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t('admin.addLogo')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโลโก้</label>
              <input
                type="text"
                value={newLogoName}
                onChange={(e) => setNewLogoName(e.target.value)}
                placeholder="ชื่อบริษัท/ลูกค้า"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
              <input
                type="text"
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddLogo}
              disabled={!newLogoName || !newLogoUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={16} className="mr-1" />
              เพิ่มโลโก้
            </button>
          </div>
          <div>
            {newLogoUrl && (
              <div className="border rounded-md p-3 h-full flex items-center justify-center bg-white">
                <img
                  src={newLogoUrl}
                  alt="Logo Preview"
                  className="max-h-20 max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=ไม่พบรูปภาพ';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Logos list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-medium">โลโก้ทั้งหมด</h2>
          <p className="text-sm text-gray-500">จัดการโลโก้ที่แสดงในสไลเดอร์ของหน้าแรก กดลูกศรเพื่อเปลี่ยนลำดับการแสดงผล</p>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {logos.map((logo) => (
            <li key={logo.id} className="p-4 flex items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-50 border rounded-md mr-4">
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name}
                  className="max-h-12 max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=ไม่พบรูปภาพ';
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{logo.name}</h3>
                <p className="text-sm text-gray-500">เพิ่มเมื่อ {logo.uploadedAt}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleToggleActive(logo.id)} 
                  className={`p-1 rounded-full ${logo.active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                  title={logo.active ? 'ซ่อน' : 'แสดง'}
                >
                  {logo.active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                
                <button 
                  onClick={() => handleMoveUp(logo.id)} 
                  disabled={logo.order === 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                  title="เลื่อนขึ้น"
                >
                  <ArrowUp size={18} />
                </button>
                
                <button 
                  onClick={() => handleMoveDown(logo.id)} 
                  disabled={logo.order === logos.length}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                  title="เลื่อนลง"
                >
                  <ArrowDown size={18} />
                </button>
                
                <button 
                  onClick={() => handleDelete(logo.id)} 
                  className="p-1 text-red-600 hover:text-red-800"
                  title="ลบ"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        {logos.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">ไม่พบโลโก้ กรุณาเพิ่มโลโก้แรกของคุณด้านบน</p>
          </div>
        )}
      </div>
      
      {/* Preview section with live slider visualization */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-2">ตัวอย่าง Slider</h2>
        <p className="text-sm text-gray-500 mb-4">
          นี่คือตัวอย่างการแสดงผลโลโก้ในสไลเดอร์ที่จะปรากฏบนหน้าเว็บไซต์
        </p>
        
        <div className="relative border rounded-md overflow-hidden">
          <div className="bg-[#f8f9fa] py-6 px-4 overflow-x-auto">
            <div className="flex space-x-10">
              {logos.filter(logo => logo.active).map((logo) => (
                <div 
                  key={logo.id}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  <div className="bg-white p-3 rounded shadow-sm">
                    <img 
                      src={logo.imageUrl} 
                      alt={logo.name}
                      className="h-12 max-w-[120px] object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <span className="text-xs bg-white px-2 py-1 rounded-full border shadow-sm">
                      ลำดับที่ {logo.order}
                    </span>
                  </div>
                </div>
              ))}
              
              {logos.filter(logo => logo.active).length === 0 && (
                <div className="text-gray-400 py-6 text-center w-full">ไม่มีโลโก้ที่ถูกเปิดใช้งาน</div>
              )}
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-gray-600">
          <strong>หมายเหตุ:</strong> เฉพาะโลโก้ที่เปิดใช้งาน (ไอคอนตา) จะแสดงในสไลเดอร์ของหน้าเว็บไซต์
          โดยจะแสดงตามลำดับที่กำหนด
        </p>
      </div>
    </div>
  );
};

export default LogosAdmin;
