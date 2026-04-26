import { apiClient, PUBLIC } from './client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>(`${PUBLIC}/auth/login`, data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>(`${PUBLIC}/auth/register`, data).then((r) => r.data),
};
