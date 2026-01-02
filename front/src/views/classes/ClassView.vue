<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchClass } from '@api/classes';
import { isAxiosError } from 'axios';
import { useSubjectsStore } from '@stores/subjects';
import { storeToRefs } from 'pinia';
import { toDateFR } from '@utils/date';

interface Subject {
  name: string;
  instructorName: string;
  instructorEmail: string;
  startDate: string;
  endDate: string;
}

interface ClassData {
  name: string;
  studentCount: number;
  studentEmails: string;
  description?: string;
  subjects: Subject[];
}

const route = useRoute();
const router = useRouter();

const initialLoading = ref(true);
const errorMessages = ref<string[]>([]);
const searchQuery = ref('');

const subjectsStore = useSubjectsStore();
const { subjects } = storeToRefs(subjectsStore);

const classId = route.params.id as string;
const classData = ref<Partial<ClassData>>({});

const filteredSubjects = computed(() => {
  if (!searchQuery.value) return subjects.value;
  const query = searchQuery.value.toLowerCase();
  return subjects.value.filter(
    (subject) => subject.name.toLowerCase().includes(query) || subject.instructorName.toLowerCase().includes(query)
  );
});

const tableColumns = [
  { key: 'subject', label: 'Matière' },
  { key: 'surveysLinks', label: 'Liens des formulaires de retours' },
  { key: 'qrCode', label: 'Code QR' },
  { key: 'actions', label: 'Retours' },
];

onMounted(async () => {
  try {
    classData.value = await fetchClass(Number(classId));
    await subjectsStore.fetchSubjects(Number(classId));
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      router.push('/classes');
    } else {
      errorMessages.value.push('Impossible de charger les données de la classe');
    }
  } finally {
    initialLoading.value = false;
  }
});
</script>

<template>
  <div class="page">
    <Header />

    <div class="page-content">
      <div class="page-header">
        <div class="details-search">
          <div class="details">
            <h3>{{ classData.name }}</h3>
            <p>{{ classData.studentCount }} étudiants</p>
          </div>
          <div class="search-wrapper">
            <Input
              class="search-input"
              v-model="searchQuery"
              placeholder="Rechercher par intervenant, cours..."
              @update:modelValue="searchQuery"
            />
          </div>
        </div>

        <div class="page-actions">
          <Button
            variant="neutral"
            icon="Arrow"
            iconPosition="right"
            @click="router.push('/classes/' + classId + '/subjects')"
          >
            Voir les matières
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            iconPosition="right"
            @click="router.push('/classes/' + classId + '/subjects/new')"
          >
            Ajouter une matière
          </Button>
        </div>
      </div>

      <Table :columns="tableColumns" :rows="filteredSubjects" striped>
        <template #cell-subject="{ row }">
          <div class="subject-cell">
            <div class="subject-details">
              <div class="subject-name-teacher">
                <p>{{ row.name }}</p>
                <p class="subject-teacher">{{ row.instructorName }}</p>
              </div>
              <p class="subject-dates">{{ toDateFR(row.startDate) }} - {{ toDateFR(row.endDate) }}</p>
            </div>
            <Button icon="Arrow" iconPosition="right" width="fit">Modifier le formulaire</Button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  gap: 16px;
}

.subject-cell {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.subject-name-teacher {
  display: flex;
  align-items: end;
  gap: 8px;
}

.subject-teacher {
  font-size: 10px;
  font-weight: 600;
}

.subject-dates {
  font-size: 12px;
}
</style>
