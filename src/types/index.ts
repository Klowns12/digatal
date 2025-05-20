export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
}

export interface Service {
  id: string;
  title: string;
  titleThai: string;
  description: string;
  descriptionThai: string;
  imageUrl: string;
  youtubeUrls?: string[]; // Added YouTube URLs array
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface ContentBlock {
  id: string;
  title: string;
  titleThai: string;
  content: string;
  contentThai: string;
  imageUrl?: string;
  section: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Add new Logo interface
export interface Logo {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
  order: number;
  uploadedAt: string;
}

// Add new interface for videos
export interface Video {
  id: string;
  title: string;
  titleThai: string;
  description: string;
  descriptionThai: string;
  youtubeUrl: string;
  categoryId: string;
  thumbnail?: string;
}