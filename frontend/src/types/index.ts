// User types
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description: string;
  color?: string;
  owner?: User;
  collaborators?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  color: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
}

export interface PaginatedResponse<T> {
  projects?: T[];
  tasks?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Task types
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  project?: {
    id: number;
    name: string;
  };
  assignedUserId?: number;
  assignedUser?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  assignedUserId?: number;
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedUserId?: number;
  dueDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: number;
  assignedUserId?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'status' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}

// Statistics types
export interface Statistics {
  totalProjects: number;
  totalTasks: number;
  projectsAsOwner: number;
  projectsAsCollaborator: number;
  tasksAssignedToMe: number;
  tasksCreatedByMe: number;
  tasksByStatus: {
    pending: number;
    'in-progress': number;
    completed: number;
  };
}
