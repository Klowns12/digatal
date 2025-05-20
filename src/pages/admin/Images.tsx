import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Copy, Check } from 'lucide-react';

// Sample image library
const initialImages = [
  {
    id: '1',
    url: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'hero-image.jpg',
    uploadedAt: '2023-06-15'
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'service-1.jpg',
    uploadedAt: '2023-06-10'
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'course-1.jpg',
    uploadedAt: '2023-05-28'
  },
  {
    id: '4',
    url: 'https://images.pexels.com/photos/4050334/pexels-photo-4050334.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'teacher.jpg',
    uploadedAt: '2023-05-15'
  }
];

const ImagesAdmin = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(img => img.id !== id));
    }
  };
  
  const handleAddImage = () => {
    if (newImageUrl && newImageName) {
      const newImage = {
        id: Date.now().toString(),
        url: newImageUrl,
        name: newImageName,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      
      setImages([...images, newImage]);
      setNewImageUrl('');
      setNewImageName('');
    }
  };
  
  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.images')}</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Image</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Name</label>
              <input
                type="text"
                value={newImageName}
                onChange={(e) => setNewImageName(e.target.value)}
                placeholder="image-name.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddImage}
              disabled={!newImageUrl || !newImageName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Add Image
            </button>
          </div>
          <div>
            {newImageUrl && (
              <div className="border rounded-md p-2 h-full flex items-center justify-center">
                <img
                  src={newImageUrl}
                  alt="Preview"
                  className="max-h-40 max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-gray-500">{image.uploadedAt}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => copyToClipboard(image.url, image.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    {copiedId === image.id ? (
                      <>
                        <Check size={14} className="mr-1" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" /> Copy URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagesAdmin;