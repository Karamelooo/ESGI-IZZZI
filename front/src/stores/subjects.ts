import { defineStore } from 'pinia';
import { fetchSubjectsByClassId } from '@api/classes';

interface Subject {
  id: number;
  name: string;
  instructorName: string;
  instructorEmail: string;
  startDate: string;
  endDate: string;
  classId: number;
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
    async fetchSubjects(classId: number) {
      this.loading = true;
      try {
        const subjects = await fetchSubjectsByClassId(classId);
        this.subjects = subjects;
      } catch (error) {
        console.error('Failed to load subjects', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
