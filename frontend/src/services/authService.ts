import { api } from './api';
import type { 
  LoginData, 
  RegisterData, 
  AuthResponse, 
  User 
} from '../types';

export const authService = {
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  },
};
