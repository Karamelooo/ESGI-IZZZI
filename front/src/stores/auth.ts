import { defineStore } from 'pinia';
import { useApi } from '@api/axios';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  institutionId: number;
  institution: {
    id: number;
    name: string;
    slug: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    initialized: false,
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
      if (this.initialized) return;
      const api = useApi();
      if (!localStorage.getItem('isAuthenticated')) {
        this.initialized = true;
        return;
      }
      try {
        const res = await api.get('/auth/me');
        this.setUser(res.data.user);
      } catch {
        this.setUser(null);
      } finally {
        this.initialized = true;
      }
    },
    async login(payload: { email: string; password: string }) {
      this.loading = true;
      const api = useApi();
      try {
        const res = await api.post('/auth/login', payload);
        this.setUser(res.data.user);
        localStorage.setItem('isAuthenticated', 'true');
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
        localStorage.setItem('isAuthenticated', 'true');
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
        localStorage.removeItem('isAuthenticated');
      }
    },
  },
});
