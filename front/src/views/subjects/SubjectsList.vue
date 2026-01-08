<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useClassesStore } from '@stores/classes';
import { useSubjectsStore } from '@stores/subjects';
import { toDateFR } from '@utils/date';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const classesStore = useClassesStore();
const subjectsStore = useSubjectsStore();

const classId = route.params.id as string;

const tableColumns = [
  { key: 'subject', label: 'Matière' },
  { key: 'instructorName', label: "Nom de l'intervenant" },
  { key: 'instructorEmail', label: "Email de l'intervenant" },
  { key: 'startDate', label: 'Date du premiers cours' },
  { key: 'endDate', label: 'Date du dernier cours' },
];

const tableRows = computed(() =>
  subjectsStore.subjects.map((subject) => ({
    subject: subject.name,
    instructorName: subject.instructorName,
    instructorEmail: subject.instructorEmail,
    startDate: toDateFR(subject.startDate),
    endDate: toDateFR(subject.endDate),
  }))
);

onMounted(async () => {
  const institutionId = authStore.user?.institution.id;

  if (institutionId) {
    await classesStore.fetchClass(Number(classId));
    await subjectsStore.fetchSubjectsByClass(Number(classId));
  } else {
    router.push('/auth');
  }
});

const handleSubmit = () => {
  console.log('handleSubmit');
};
</script>

<template>
  <div class="page">
    <Header />

    <div class="page-content">
      <div class="page-header">
        <div class="details-class">
          <div class="details">
            <h2>Mes matières</h2>
          </div>
          <p>{{ classesStore.class?.name }}</p>
        </div>

        <div class="page-actions">
          <Button
            variant="neutral"
            icon="Plus"
            iconPosition="right"
            @click="router.push('/classes/' + classId + '/subjects/new')"
          >
            Ajouter une matière
          </Button>
          <Button icon="Arrow" iconPosition="right" @click="handleSubmit"> Valider </Button>
        </div>
      </div>

      <Table :columns="tableColumns" :rows="tableRows" striped>
        <template #cell-instructorEmail="{ row }">{{ row.instructorEmail }}</template>
      </Table>
    </div>
  </div>
</template>

<style scoped></style>
