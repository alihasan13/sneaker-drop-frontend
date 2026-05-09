import apiClient from './client';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export const usersApi = {
  getDemoUsers: async (): Promise<DemoUser[]> => {
    const { data } = await apiClient.get('/users');
    return data.data;
  },
};
