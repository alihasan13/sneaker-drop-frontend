import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';

const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach X-User-Id header to every request
apiClient.interceptors.request.use((config) => {
  const userId = useUserStore.getState().currentUser?.id;
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

// handles  error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverError = error.response?.data?.error;
    if (serverError) {
      const normalized = new Error(serverError.message) as any;
      normalized.code = serverError.code;
      normalized.statusCode = serverError.statusCode;
      return Promise.reject(normalized);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
