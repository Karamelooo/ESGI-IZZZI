import { useAuthStore } from '@stores/auth';
import { useRouter } from 'vue-router';
import { useApi } from '@api/axios';

export function useTypedApi() {
  const authStore = useAuthStore();
  const router = useRouter();
  return useApi(authStore, router);
}
