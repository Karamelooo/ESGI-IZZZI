import { useTypedApi } from './helper';

export interface CreateSubjectPayload {
  name: string;
  instructorName: string;
  instructorEmail?: string;
  startDate?: string;
  endDate?: string;
  classId: number;
}

export async function createSubject(payload: CreateSubjectPayload) {
  const api = useTypedApi();
  const response = await api.post('/subjects', payload);
  return response.data;
}

export async function createSubjectsBulk(payload: CreateSubjectPayload[]) {
  const api = useTypedApi();
  const response = await api.post('/subjects/bulk', payload);
  return response.data;
}
