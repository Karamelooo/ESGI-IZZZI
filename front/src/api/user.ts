import { useTypedApi } from './helper';

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function updateMe(payload: UpdateUserPayload) {
  const api = useTypedApi();
  const response = await api.patch('/users/me', payload);
  return response.data;
}

export async function updateMyPassword(payload: UpdatePasswordPayload) {
  const api = useTypedApi();
  const response = await api.patch('/users/me/update-password', payload);
  return response.data;
}

export async function removeMe() {
  const api = useTypedApi();
  const response = await api.patch('/users/me/remove');
  return response.data;
}
