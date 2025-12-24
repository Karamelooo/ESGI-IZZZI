import { useTypedApi } from './helper';

export interface CreateClassPayload {
  name: string;
  studentCount: number;
  studentEmails: string;
  description?: string;
}

export async function createClass(payload: CreateClassPayload) {
  const api = useTypedApi();
  const response = await api.post('/classes', payload);
  return response.data;
}
