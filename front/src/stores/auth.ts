import { defineStore } from 'pinia';
import type { Router } from 'vue-router';
import { useTypedApi } from '@api/helper';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  institutionId: number;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated(state): boolean {
      return state.user !== null;
    },
    getUser(state): User | null {
      return state.user;
    },
  },
  actions: {
    setUser(userData: User | null) {
      this.user = userData;
    },
    async logout(router: Router) {
      const api = useTypedApi();
      try {
        await api.post('/auth/logout');
      } finally {
        this.setUser(null);
        router.push('/login');
      }
    },
  },
});
