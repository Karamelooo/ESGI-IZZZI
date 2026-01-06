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
  studentEmails: string;
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
    async fetchClasses(withDeleted: boolean = false) {
      this.loading = true;
      try {
        const data = await fetchClassesApi(withDeleted);
        if (withDeleted) {
          this.archivedClasses = data.filter((classItem: Class) => classItem.deletedAt);
        } else {
          this.classes = data;
        }
      } catch (error) {
        console.error('Failed to load classes', error);
        this.classes = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchClass(id: number) {
      try {
        const data = await fetchClassApi(id);
        this.class = data;
      } catch (error) {
        console.error('Failed to load class', error);
        this.class = null;
      }
    },
    async deleteClass(classId: number) {
      try {
        await deleteClassApi(classId);
        this.classes = this.classes.filter((classItem) => classItem.id !== classId);
      } catch (error) {
        console.error('Failed to delete class', error);
        throw error;
      }
    },
  },
});
