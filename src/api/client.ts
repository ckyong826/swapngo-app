import axios from 'axios';
import { env } from '@/config/env';
import { storageService } from '@/services/storage.service';
import { router } from 'expo-router';

export const PUBLIC = '/api/v1/public';
export const PRIVATE = '/api/v1/private';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storageService.deleteToken();
      router.replace('/(auth)/login');
    }
    const message: string =
      error.response?.data?.message ?? error.message ?? 'An error occurred';
    return Promise.reject({ message, code: error.response?.status?.toString() });
  }
);
