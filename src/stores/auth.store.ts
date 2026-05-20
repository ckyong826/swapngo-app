import { create } from 'zustand';
import { storageService } from '@/services/storage.service';
import { wsService } from '@/services/websocket.service';
import { router } from 'expo-router';

interface AuthStore {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setToken: async (token) => {
    await storageService.setToken(token);
    wsService.connect(token);
    set({ accessToken: token, isAuthenticated: true });
  },

  loadToken: async () => {
    const token = await storageService.getToken();
    if (token) {
      wsService.connect(token);
      set({ accessToken: token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    wsService.disconnect();
    await storageService.deleteToken();
    set({ accessToken: null, isAuthenticated: false });
    router.replace('/(auth)/login');
  },
}));
