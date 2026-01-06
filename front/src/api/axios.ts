import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';

export function useApi() {
  const router = useRouter();
  const authStore = useAuthStore();
  const instance = axios.create({
    baseURL: import.meta.env.API_URL || (window as any).config?.API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  let isRefreshing = false;
  let pendingQueue: Array<() => void> = [];

  instance.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await instance.post('/auth/refresh');
            pendingQueue.forEach((fn) => fn());
            pendingQueue = [];
            isRefreshing = false;
            return instance.request(error.config!);
          } catch {
            isRefreshing = false;
            authStore.setUser(null);
            localStorage.removeItem('isAuthenticated');
            router.push('/auth');
            return Promise.reject(error);
          }
        }
        return new Promise((resolve) => {
          pendingQueue.push(async () => {
            resolve(instance.request(error.config!));
          });
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export default useApi;
