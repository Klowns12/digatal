import { Logo } from '../types';

// Initial logos
const initialLogos: Logo[] = [
  {
    id: '1',
    name: 'Client Logo 1',
    imageUrl: '/imags/client-logo1.png',
    active: true,
    order: 1,
    uploadedAt: '2023-05-15'
  },
  {
    id: '2',
    name: 'Client Logo 2',
    imageUrl: '/imags/client-logo2.png',
    active: true,
    order: 2,
    uploadedAt: '2023-05-15'
  },
  {
    id: '3',
    name: 'Client Logo 3',
    imageUrl: '/imags/client-logo3.png',
    active: true,
    order: 3,
    uploadedAt: '2023-05-16'
  },
  {
    id: '4',
    name: 'Client Logo 4',
    imageUrl: '/imags/client-logo4.png',
    active: true,
    order: 4,
    uploadedAt: '2023-05-16'
  },
  {
    id: '5',
    name: 'Client Logo 5',
    imageUrl: '/imags/client-logo5.png',
    active: true,
    order: 5,
    uploadedAt: '2023-05-17'
  },
  {
    id: '6',
    name: 'Client Logo 6',
    imageUrl: '/imags/client-logo6.png',
    active: true,
    order: 6,
    uploadedAt: '2023-05-17'
  }
];

// Local storage key
const STORAGE_KEY = 'client_logos';

// Load logos from storage or use defaults
const loadLogos = (): Logo[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialLogos;
};

// Save logos to storage
const saveLogos = (logos: Logo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('logos-updated'));
};

// Get all logos
export const getLogos = (): Logo[] => {
  return loadLogos().sort((a, b) => a.order - b.order);
};

// Get active logos
export const getActiveLogos = (): Logo[] => {
  return loadLogos()
    .filter(logo => logo.active)
    .sort((a, b) => a.order - b.order);
};

// Add a new logo
export const addLogo = (logo: Omit<Logo, 'id' | 'order' | 'uploadedAt'>): void => {
  const logos = loadLogos();
  const newLogo: Logo = {
    ...logo,
    id: `logo-${Date.now()}`,
    order: logos.length + 1,
    uploadedAt: new Date().toISOString().split('T')[0]
  };
  
  saveLogos([...logos, newLogo]);
};

// Update a logo
export const updateLogo = (id: string, updates: Partial<Logo>): void => {
  const logos = loadLogos();
  const updatedLogos = logos.map(logo => 
    logo.id === id ? { ...logo, ...updates } : logo
  );
  saveLogos(updatedLogos);
};

// Delete a logo
export const deleteLogo = (id: string): void => {
  const logos = loadLogos();
  const filteredLogos = logos.filter(logo => logo.id !== id);
  
  // Reorder remaining logos
  const reorderedLogos = filteredLogos.map((logo, index) => ({
    ...logo,
    order: index + 1
  }));
  
  saveLogos(reorderedLogos);
};

// Toggle logo active state
export const toggleLogoActive = (id: string): void => {
  const logos = loadLogos();
  const updatedLogos = logos.map(logo => 
    logo.id === id ? { ...logo, active: !logo.active } : logo
  );
  saveLogos(updatedLogos);
};

// Move logo up in order
export const moveLogoUp = (id: string): void => {
  const logos = loadLogos().sort((a, b) => a.order - b.order);
  const index = logos.findIndex(logo => logo.id === id);
  
  if (index <= 0) return;
  
  // Swap orders with the logo above
  const temp = logos[index].order;
  logos[index].order = logos[index - 1].order;
  logos[index - 1].order = temp;
  
  saveLogos(logos);
};

// Move logo down in order
export const moveLogoDown = (id: string): void => {
  const logos = loadLogos().sort((a, b) => a.order - b.order);
  const index = logos.findIndex(logo => logo.id === id);
  
  if (index === -1 || index >= logos.length - 1) return;
  
  // Swap orders with the logo below
  const temp = logos[index].order;
  logos[index].order = logos[index + 1].order;
  logos[index + 1].order = temp;
  
  saveLogos(logos);
};  