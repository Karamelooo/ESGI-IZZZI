import { defineStore } from 'pinia';
import {
  fetchClasses as fetchClassesApi,
  fetchClass as fetchClassApi,
  deleteClass as deleteClassApi,
} from '@api/classes';

export interface Class {
  id: number;
  name: string;
  description?: string;
  studentCount: number;
  studentEmails: string[];
  institutionId: number;
  deletedAt?: string | null;
}

interface ClassesState {
  class: Class | null;
  classes: Class[];
  archivedClasses: Class[];
  loading: boolean;
}

export const useClassesStore = defineStore('classes', {
  state: (): ClassesState => ({
    class: null,
    classes: [],
    archivedClasses: [],
    loading: false,
  }),
  actions: {
    async fetchClasses(institutionId: number, withDeleted: boolean = false) {
      if (!institutionId) return;
      this.loading = true;
      try {
        const data = await fetchClassesApi(withDeleted);
        if (withDeleted) {
          this.archivedClasses = data.filter((c: Class) => c.deletedAt);
        } else {
          this.classes = data;
        }
      } catch (e) {
        this.classes = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchClass(id: number) {
      try {
        const data = await fetchClassApi(id);
        this.class = data;
      } catch (e) {
        this.class = null;
      }
    },
    async deleteClass(classId: number) {
      try {
        await deleteClassApi(classId);
        this.classes = this.classes.filter((c) => c.id !== classId);
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  },
});
