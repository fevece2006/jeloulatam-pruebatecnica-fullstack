
import { create } from 'zustand';
import { authService } from '../services/authService';
import type { User, RegisterData } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    const { user, token } = await authService.login({ email, password });
    localStorage.setItem('authToken', token);
    set({ user, isAuthenticated: true });
  },
  
  register: async (userData) => {
    const { user, token } = await authService.register(userData);
    localStorage.setItem('authToken', token);
    set({ user, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const user = await authService.getProfile();
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      set({ isLoading: false });
    }
  },
}));