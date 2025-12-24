import { defineStore } from 'pinia';
import { useApi } from '@api/axios';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  institutionId: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
  }),
  getters: {
    isAuthenticated(state): boolean {
      return state.user !== null;
    },
  },
  actions: {
    setUser(userData: User | null) {
      this.user = userData;
    },
    async fetchMe() {
      if (this.user) return;
      const api = useApi();
      try {
        const res = await api.get('/auth/me');
        this.setUser(res.data.user);
      } catch {
        this.setUser(null);
      }
    },
    async login(payload: { email: string; password: string }) {
      this.loading = true;
      const api = useApi();
      try {
        const res = await api.post('/auth/login', payload);
        this.setUser(res.data.user);
      } catch {
        throw new Error('Connexion échouée');
      } finally {
        this.loading = false;
      }
    },
    async register(payload: {
      institutionName: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) {
      this.loading = true;
      const api = useApi();
      try {
        const res = await api.post('/auth/register', payload);
        this.setUser(res.data.user);
      } catch {
        throw new Error('Inscription échouée');
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      const api = useApi();
      try {
        await api.post('/auth/logout');
      } finally {
        this.setUser(null);
      }
    },
  },
});
