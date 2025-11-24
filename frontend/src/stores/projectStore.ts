import { create } from 'zustand';
import { projectService } from '../services/projectService';
import type { Project, CreateProjectData, UpdateProjectData } from '../types';
import toast from 'react-hot-toast';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchProjects: (page?: number, search?: string) => Promise<void>;
  fetchProjectById: (id: number) => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: number, data: UpdateProjectData) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addCollaborator: (projectId: number, userId: number) => Promise<void>;
  removeCollaborator: (projectId: number, userId: number) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  fetchProjects: async (page = 1, search?: string) => {
    set({ loading: true });
    try {
      const response = await projectService.getProjects(page, get().pagination.limit, search);
      set({
        projects: response.projects,
        pagination: response.pagination,
      });
    } catch (error) {
      toast.error('Error al cargar proyectos');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProjectById: async (id: number) => {
    set({ loading: true });
    try {
      const project = await projectService.getProjectById(id);
      set({ currentProject: project });
    } catch (error) {
      toast.error('Error al cargar el proyecto');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (data: CreateProjectData) => {
    try {
      const project = await projectService.createProject(data);
      set((state) => ({
        projects: [project, ...state.projects],
      }));
      toast.success('Proyecto creado exitosamente');
      return project;
    } catch (error) {
      toast.error('Error al crear el proyecto');
      throw error;
    }
  },

  updateProject: async (id: number, data: UpdateProjectData) => {
    try {
      const updatedProject = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
      }));
      toast.success('Proyecto actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el proyecto');
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    try {
      await projectService.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
      }));
      toast.success('Proyecto eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el proyecto');
      throw error;
    }
  },

  addCollaborator: async (projectId: number, userId: number) => {
    try {
      const updatedProject = await projectService.addCollaborator(projectId, userId);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
        currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
      }));
      toast.success('Colaborador añadido exitosamente');
    } catch (error) {
      toast.error('Error al añadir colaborador');
      throw error;
    }
  },

  removeCollaborator: async (projectId: number, userId: number) => {
    try {
      const updatedProject = await projectService.removeCollaborator(projectId, userId);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
        currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
      }));
      toast.success('Colaborador removido exitosamente');
    } catch (error) {
      toast.error('Error al remover colaborador');
      throw error;
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },
}));
