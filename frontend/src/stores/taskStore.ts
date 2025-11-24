import { create } from 'zustand';
import { taskService } from '../services/taskService';
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStatus } from '../types';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  filters: TaskFilters;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTaskById: (id: number) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: number, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTaskStatus: (id: number, status: TaskStatus) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  setCurrentTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  filters: {},

  fetchTasks: async (filters?: TaskFilters) => {
    set({ loading: true });
    try {
      const tasks = await taskService.getTasks(filters || get().filters);
      set({ tasks });
    } catch (error) {
      toast.error('Error al cargar tareas');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTaskById: async (id: number) => {
    set({ loading: true });
    try {
      const task = await taskService.getTaskById(id);
      set({ currentTask: task });
    } catch (error) {
      toast.error('Error al cargar la tarea');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (data: CreateTaskData) => {
    try {
      const task = await taskService.createTask(data);
      set((state) => ({
        tasks: [task, ...state.tasks],
      }));
      toast.success('Tarea creada exitosamente');
      return task;
    } catch (error) {
      toast.error('Error al crear la tarea');
      throw error;
    }
  },

  updateTask: async (id: number, data: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
      }));
      toast.success('Tarea actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la tarea');
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    try {
      await taskService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
      }));
      toast.success('Tarea eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
      throw error;
    }
  },

  updateTaskStatus: async (id: number, status: TaskStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
      }));
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar el estado');
      throw error;
    }
  },

  setFilters: (filters: TaskFilters) => {
    set({ filters });
  },

  setCurrentTask: (task: Task | null) => {
    set({ currentTask: task });
  },
}));
