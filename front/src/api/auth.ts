import axios from 'axios';

const API_URL = import.meta.env.API_URL || 'http://localhost:3500';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

export async function login(payload: LoginPayload) {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await axios.post(`${API_URL}/auth/register`, payload);
  return response.data;
}
