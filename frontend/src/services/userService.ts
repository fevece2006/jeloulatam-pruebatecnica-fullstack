import { api } from './api';
import type { User } from '../types';

export const userService = {
  // Listar todos los usuarios
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  // Obtener usuario por ID
  getUserById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Buscar usuarios (legacy, puede ser útil para búsqueda)
  searchUsers: async (query: string): Promise<User[]> => {
    const { data } = await api.get<User[]>(`/users/search?q=${query}`);
    return data;
  },
};
