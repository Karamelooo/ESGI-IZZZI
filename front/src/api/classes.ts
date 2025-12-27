import { useTypedApi } from './helper';

export interface CreateClassPayload {
  name: string;
  studentCount: number;
  studentEmails: string;
  description?: string;
}

export async function fetchClasses(institutionId: number, withDeleted: boolean = false) {
  const api = useTypedApi();
  const response = await api.get(`/classes?institutionId=${institutionId}${withDeleted ? '&withDeleted=true' : ''}`);
  return response.data;
}

export async function fetchClass(id: string) {
  const api = useTypedApi();
  const response = await api.get(`/classes/${id}`);
  return response.data;
}

export async function createClass(payload: CreateClassPayload) {
  const api = useTypedApi();
  const response = await api.post('/classes', payload);
  return response.data;
}

export async function updateClass(id: string, payload: CreateClassPayload) {
  const api = useTypedApi();
  const response = await api.patch(`/classes/${id}`, payload);
  return response.data;
}

export async function deleteClass(classId: number) {
  const api = useTypedApi();
  const response = await api.patch(`/classes/${classId}/remove`);
  return response.data;
}
