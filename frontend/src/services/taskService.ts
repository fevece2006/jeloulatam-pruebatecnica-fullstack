import { api } from './api';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
} from '../types';

export const taskService = {
  getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.projectId) params.append('projectId', filters.projectId.toString());
    if (filters?.assignedUserId) params.append('assignedUserId', filters.assignedUserId.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const { data } = await api.get<{ tasks: Task[] }>(`/tasks?${params}`);
    return data.tasks;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', taskData);
    return data;
  },

  updateTask: async (id: number, taskData: UpdateTaskData): Promise<Task> => {
    const { data } = await api.put<Task>(`/tasks/${id}`, taskData);
    return data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id: number, status: Task['status']): Promise<Task> => {
    // Usar PUT en lugar de PATCH para actualizar solo el estado
    const { data } = await api.put<Task>(`/tasks/${id}`, { status });
    return data;
  },
};
