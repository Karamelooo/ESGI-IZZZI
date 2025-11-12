import { defineStore } from 'pinia';
import api from '@api/axios';
import type { Router } from 'vue-router';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  institutionId: number;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    setAccessToken(token: string | null) {
      this.accessToken = token;
    },
    setUser(userData: User | null) {
      this.user = userData;
    },
    async logout(router: Router) {
      try {
        await api.post('/auth/logout');
      } finally {
        this.setAccessToken(null);
        this.setUser(null);
        router.push('/login');
      }
    },
  },
});
