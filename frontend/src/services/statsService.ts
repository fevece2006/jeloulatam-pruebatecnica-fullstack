import { api } from './api';
import type { Statistics } from '../types';

export const statsService = {
  getStatistics: async (): Promise<Statistics> => {
    const { data } = await api.get<Statistics>('/stats');
    return data;
  },
};
