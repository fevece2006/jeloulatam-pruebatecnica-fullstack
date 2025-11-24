import { api } from './api';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  PaginatedResponse,
  User,
} from '../types';

export const projectService = {
  getProjects: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const { data } = await api.get<PaginatedResponse<Project>>(`/projects?${params}`);
    return data;
  },

  getProjectById: async (id: number): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },

  createProject: async (projectData: CreateProjectData): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', projectData);
    return data;
  },

  updateProject: async (id: number, projectData: UpdateProjectData): Promise<Project> => {
    const { data } = await api.put<Project>(`/projects/${id}`, projectData);
    return data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  addCollaborator: async (projectId: number, userId: number): Promise<Project> => {
    const { data } = await api.post<Project>(`/projects/${projectId}/collaborators`, { userId });
    return data;
  },

  addCollaboratorsBulk: async (projectId: number, userIds: number[]): Promise<Project> => {
    const { data } = await api.post<Project>(`/projects/${projectId}/collaborators/bulk`, { userIds });
    return data;
  },

  removeCollaborator: async (projectId: number, userId: number): Promise<Project> => {
    const { data } = await api.delete<Project>(`/projects/${projectId}/collaborators/${userId}`);
    return data;
  },

  getCollaborators: async (projectId: number): Promise<User[]> => {
    const { data } = await api.get<{ collaborators: User[] }>(`/projects/${projectId}/collaborators`);
    return data.collaborators;
  },
};
