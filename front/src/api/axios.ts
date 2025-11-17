import axios from 'axios';
import { useRouter } from 'vue-router';

export function useApi(router = useRouter()) {
  const instance = axios.create({
    baseURL: import.meta.env.API_URL || 'http://localhost:3500',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export default useApi;
