import { defineStore } from 'pinia';
import { fetchClasses as fetchClassesApi, deleteClass as deleteClassApi } from '@api/classes';

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
  classes: Class[];
  archivedClasses: Class[];
  loading: boolean;
}

export const useClassesStore = defineStore('classes', {
  state: (): ClassesState => ({
    classes: [],
    archivedClasses: [],
    loading: false,
  }),
  actions: {
    async fetchClasses(institutionId: number, withDeleted: boolean = false) {
      if (!institutionId) return;
      this.loading = true;
      try {
        const data = await fetchClassesApi(institutionId, withDeleted);
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
