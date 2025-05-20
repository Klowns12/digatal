import { create } from 'zustand';
import { User } from '../types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// In a real app, you would validate against your backend
const MOCK_ADMIN_USER: User = {
  id: '1',
  username: 'admin',
  isAdmin: true,
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (username: string, password: string) => {
    // In a real app, this would be an API call
    if (username === 'admin' && password === 'admin123') {
      set({ user: MOCK_ADMIN_USER, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));