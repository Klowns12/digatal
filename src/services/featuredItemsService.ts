// A simple service to manage featured items across components

// Initial featured items configuration
const initialFeaturedItems = {
  'elearning': [1, 2, 3, 12], // IDs of featured items
  'video': [1, 2, 3, 4],
  '360': [1, 2, 3, 4],
  'lms': [1, 2, 3, 4],
  'web': [1, 2, 3, 4]
};

// Use localStorage to persist between page refreshes
const STORAGE_KEY = 'featured_items';

// Load from localStorage or use initial values
const loadFeaturedItems = (): Record<string, number[]> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialFeaturedItems;
};

// Get current featured items
export const getFeaturedItems = (): Record<string, number[]> => {
  return loadFeaturedItems();
};

// Update featured items for a category
export const updateFeaturedItems = (categoryId: string, itemIds: number[]): void => {
  const current = loadFeaturedItems();
  const updated = {
    ...current,
    [categoryId]: itemIds
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // Dispatch a custom event so other components can react to changes
  window.dispatchEvent(new CustomEvent('featured-items-changed', { 
    detail: { categoryId, itemIds } 
  }));
};

// Toggle an item's featured status
export const toggleItemFeatured = (categoryId: string, itemId: number): boolean => {
  const current = loadFeaturedItems();
  const categoryItems = current[categoryId] || [];
  
  let updatedItems: number[];
  let isFeatured: boolean;
  
  if (categoryItems.includes(itemId)) {
    // Remove item
    updatedItems = categoryItems.filter(id => id !== itemId);
    isFeatured = false;
  } else {
    // Add item (if less than 4 are featured)
    if (categoryItems.length >= 4) return false;
    updatedItems = [...categoryItems, itemId];
    isFeatured = true;
  }
  
  updateFeaturedItems(categoryId, updatedItems);
  return isFeatured;
};

// Check if an item is featured
export const isItemFeatured = (categoryId: string, itemId: number): boolean => {
  const items = loadFeaturedItems()[categoryId] || [];
  return items.includes(itemId);
};
