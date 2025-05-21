import React, { useState, useEffect } from 'react';
import { getLocation, updateLocation, generateEmbedMapUrl } from '../../services/locationService';
import { Location } from '../../types/location';
import { MapPin, Check, Globe } from 'lucide-react';

const LocationManager = () => {
  const [location, setLocation] = useState<Location>(getLocation());
  const [activeTab, setActiveTab] = useState<'en' | 'th'>('en');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: keyof Location, value: any) => {
    if (field === 'address') {
      setLocation(prev => ({
        ...prev,
        address: { ...prev.address, [activeTab]: value }
      }));
    } else {
      setLocation(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    updateLocation(location);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-blue-600" />
            จัดการตำแหน่งที่ตั้ง
          </h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('en')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'en' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-1" />
              English
            </button>
            <button
              onClick={() => setActiveTab('th')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'th' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-1" />
              ไทย
            </button>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2" />
            บันทึกการเปลี่ยนแปลงแล้ว
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ละติจูด</label>
              <input
                type="number"
                step="0.000001"
                value={location.latitude}
                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ลองจิจูด</label>
              <input
                type="number"
                step="0.000001"
                value={location.longitude}
                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ระดับการซูม</label>
              <input
                type="number"
                min="1"
                max="20"
                value={location.zoom}
                onChange={(e) => handleChange('zoom', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ที่อยู่</label>
            <textarea
              value={location.address[activeTab]}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Google Maps URL</label>
            <input
              type="text"
              value={location.googleMapsUrl}
              onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-medium mb-4">ตัวอย่างแผนที่</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
            <iframe
              src={generateEmbedMapUrl(location.latitude, location.longitude, location.zoom)}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManager;
