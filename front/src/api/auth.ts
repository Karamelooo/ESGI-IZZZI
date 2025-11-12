import { useTypedApi } from './helper';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  institutionName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function login(payload: LoginPayload) {
  const api = useTypedApi();
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const api = useTypedApi();
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function refresh() {
  const api = useTypedApi();
  const response = await api.post('/auth/refresh');
  return response.data;
}

export async function logout() {
  const api = useTypedApi();
  const response = await api.post('/auth/logout');
  return response.data;
}
