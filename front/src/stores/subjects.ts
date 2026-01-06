import { defineStore } from 'pinia';
import { fetchSubjects } from '@api/subjects';
import { fetchSubjectsByClassId } from '@api/classes';

export interface Subject {
  id: number;
  name: string;
  instructorName: string;
  instructorEmail: string;
  startDate: string;
  endDate: string;
  classId: number;
  institutionId: number;
}

interface SubjectsState {
  subjects: Subject[];
  loading: boolean;
}

export const useSubjectsStore = defineStore('subjects', {
  state: (): SubjectsState => ({
    subjects: [],
    loading: false,
  }),
  actions: {
    async fetchSubjects(withDeleted: boolean = false) {
      this.loading = true;
      try {
        const subjects = await fetchSubjects(withDeleted);
        this.subjects = subjects;
      } catch (error) {
        console.error('Failed to load subjects', error);
        this.subjects = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchSubjectsByClass(classId: number) {
      this.loading = true;
      try {
        const subjects = await fetchSubjectsByClassId(classId);
        this.subjects = subjects;
      } catch (error) {
        console.error('Failed to load subjects', error);
        this.subjects = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
