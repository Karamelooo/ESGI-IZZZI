import { defineStore } from 'pinia';
import api from '@api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    user: null as unknown | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    setAccessToken(token: string | null) {
      this.accessToken = token;
    },
    setUser(userData: unknown) {
      this.user = userData;
    },
    async logout() {
      try {
        await api.post('/auth/logout');
      } finally {
        this.accessToken = null;
        this.user = null;
        window.location.href = '/login';
      }
    },
  },
});
