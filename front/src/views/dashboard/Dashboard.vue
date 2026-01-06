<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useSubjectsStore } from '@stores/subjects';
import DashboardSubjectItem from '@components/dashboard/DashboardSubjectItem.vue';

const router = useRouter();
const authStore = useAuthStore();
const subjectsStore = useSubjectsStore();

const searchQuery = ref('');
const sortOption = ref('');
const filterOption = ref('');

const sortOptions = [
  { label: 'Plus récent', value: 'newest' },
  { label: 'Plus ancien', value: 'oldest' },
];

const resetFilters = () => {
  sortOption.value = '';
  filterOption.value = '';
};

const filterOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Pendant le cours', value: 'ongoing' },
  { label: 'Fin de cours', value: 'finished' },
];

const filteredSubjects = computed(() => {
  let subjects = [...subjectsStore.subjects];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    subjects = subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        subject.instructorName.toLowerCase().includes(query) ||
        subject.class.name.toLowerCase().includes(query)
    );
  }

  const now = new Date();
  if (filterOption.value === 'ongoing') {
    subjects = subjects.filter((s) => new Date(s.endDate) > now);
  } else if (filterOption.value === 'finished') {
    subjects = subjects.filter((s) => new Date(s.endDate) <= now);
  }

  subjects.sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortOption.value === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return subjects;
});

onMounted(async () => {
  const institutionId = authStore.user?.institution.id;

  if (institutionId) {
    await subjectsStore.fetchSubjects();
  } else {
    router.push('/auth');
  }
});
</script>

<template>
  <div class="page">
    <Header />

    <div class="page-content">
      <div class="page-header">
        <div class="search-wrapper">
          <Input
            v-model="searchQuery"
            class="search-input"
            icon-right="Search"
            placeholder="Rechercher par classe, intervenant, cours..."
          />
        </div>

        <div class="filters">
          <IconButton icon="Reload" @click="resetFilters" />
          <Select v-model="sortOption" :options="sortOptions" placeholder="Trier par" />
          <Select v-model="filterOption" :options="filterOptions" placeholder="Filtrer par" />
        </div>
      </div>

      <div class="subjects-list">
        <DashboardSubjectItem v-for="subject in filteredSubjects" :key="subject.id" :subjectItem="subject" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.search-wrapper {
  min-width: 420px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filters .icon-button-wrapper {
  width: 40px;
  height: 40px;
  background-color: var(--white);
}

.filters .select-wrapper {
  flex: 1;
}

.subjects-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1280px) {
  .subjects-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 2500px) {
  .subjects-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
