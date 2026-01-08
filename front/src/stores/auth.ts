import { defineStore } from 'pinia';
import { login as loginApi, register as registerApi, logout as logoutApi, fetchMe as fetchMeApi } from '@api/auth';

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
  };
  subscription?: {
    plan: string;
    billingPeriod: 'trial' | 'monthly' | 'annual';
    endDate: string | null;
  } | null;
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
      if (!localStorage.getItem('isAuthenticated')) {
        this.initialized = true;
        return;
      }
      try {
        const data = await fetchMeApi();
        this.setUser(data.user);
      } catch {
        this.setUser(null);
      } finally {
        this.initialized = true;
      }
    },
    async login(payload: { email: string; password: string }) {
      this.loading = true;
      try {
        const data = await loginApi(payload);
        this.setUser(data.user);
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
      try {
        const data = await registerApi(payload);
        this.setUser(data.user);
        localStorage.setItem('isAuthenticated', 'true');
      } catch {
        throw new Error('Inscription échouée');
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await logoutApi();
      } finally {
        this.setUser(null);
        localStorage.removeItem('isAuthenticated');
      }
    },
  },
});
