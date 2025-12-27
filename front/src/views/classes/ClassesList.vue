<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useClassesStore } from '@stores/classes';
import ClassesListItem from '@components/classes/ClassesListItem.vue';

const router = useRouter();
const authStore = useAuthStore();
const classesStore = useClassesStore();

const searchQuery = ref('');
const isViewingArchived = ref(false);

const toggleView = async () => {
  isViewingArchived.value = !isViewingArchived.value;
  const institutionId = authStore.user?.institution.id;
  if (institutionId) {
    await classesStore.fetchClasses(institutionId, isViewingArchived.value);
  }
};

const currentList = computed(() => (isViewingArchived.value ? classesStore.archivedClasses : classesStore.classes));

const hasClasses = computed(() => currentList.value.length > 0);

const filteredList = computed(() => {
  return currentList.value.filter((c) => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

onMounted(async () => {
  const institutionId = authStore.user?.institution.id;

  if (institutionId) {
    await classesStore.fetchClasses(institutionId);
  } else {
    router.push('/auth');
  }
});
</script>

<template>
  <div class="page" :style="{ gap: hasClasses || (!hasClasses && isViewingArchived) ? '32px' : undefined }">
    <Header :disabled="!hasClasses && !isViewingArchived" />

    <div v-if="hasClasses" class="page-content">
      <div class="page-header">
        <div class="details-search">
          <div class="details">
            <h3>{{ currentList.length }} classes {{ isViewingArchived ? 'archivées' : 'actives' }}</h3>
            <p v-if="!isViewingArchived">Vous pouvez ajouter jusqu'à 5 classes.</p>
            <p v-else>Les classes archivées ne sont plus modifiables mais restent consultables.</p>
          </div>
          <div class="search-wrapper">
            <Input
              class="search-input"
              v-model="searchQuery"
              placeholder="Rechercher une classe..."
              @update:modelValue="searchQuery"
            />
          </div>
        </div>
        <Button v-if="!isViewingArchived" icon="Plus" iconPosition="right" @click="router.push('/classes/new')">
          Ajouter une classe
        </Button>
      </div>

      <div class="classes-grid">
        <ClassesListItem
          v-for="listItem in filteredList"
          :key="listItem.id"
          :classItem="listItem"
          :isArchived="isViewingArchived"
        />
      </div>

      <Button variant="plain" icon="Arrow" iconPosition="right" @click="toggleView">
        {{ isViewingArchived ? 'Voir les classes actives' : 'Voir les classes archivées' }}
      </Button>
    </div>

    <Card
      v-else-if="!isViewingArchived && !hasClasses"
      :fullWidth="true"
      :fullHeight="true"
      :centered="true"
      :spacing="36"
    >
      <h2>Pour commencer,<br />créez une classe</h2>
      <Button icon="Arrow" iconPosition="right" @click="router.push('/classes/new')">Je créé une classe</Button>
    </Card>

    <div v-else-if="isViewingArchived && !hasClasses" class="page-content">
      <div class="page-header">
        <div class="details-search">
          <div class="details">
            <h3>Aucune classe archivée</h3>
            <p>Les classes archivées ne sont plus modifiables mais restent consultables.</p>
          </div>
        </div>
      </div>

      <Button variant="plain" icon="Arrow" iconPosition="right" @click="toggleView"> Voir les classes actives </Button>
    </div>
  </div>
</template>

<style scoped>
.classes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .classes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .classes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
