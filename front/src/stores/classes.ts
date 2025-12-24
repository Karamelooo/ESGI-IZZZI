import { defineStore } from 'pinia';
import { useApi } from '@api/axios';

export interface Class {
  id: number;
  name: string;
  institutionId: number;
}

interface ClassesState {
  classes: Class[];
  loading: boolean;
}

export const useClassesStore = defineStore('classes', {
  state: (): ClassesState => ({
    classes: [],
    loading: false,
  }),
  actions: {
    async fetchClasses(institutionId: number) {
      if (!institutionId) return;
      this.loading = true;
      const api = useApi();
      try {
        const res = await api.get(`/classes?institutionId=${institutionId}`);
        this.classes = res.data;
      } catch (e) {
        this.classes = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
