import axios from 'axios';
import { useAuthStore } from '@stores/auth';
import { useRouter } from 'vue-router';

export function useApi(authStore = useAuthStore(), router = useRouter()) {
  const instance = axios.create({
    baseURL: import.meta.env.API_URL || 'http://localhost:3500',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      if (authStore.accessToken) {
        config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log('Response:', response);
      debugger;
      return response;
    },
    async (error) => {
      console.log('Response Error:', error.response);
      debugger;
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await instance.post('/auth/refresh');
          const newToken = refreshResponse.data?.accessToken;
          if (newToken) {
            authStore.setAccessToken(newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          authStore.setAccessToken(null);
          authStore.setUser(null);
          router.push('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export default useApi;
