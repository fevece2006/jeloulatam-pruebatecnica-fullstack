export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const TASK_STATUSES = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in-progress' as const,
  COMPLETED: 'completed' as const,
};

export const TASK_PRIORITIES = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
