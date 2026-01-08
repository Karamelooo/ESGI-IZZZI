<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@stores/auth';
import { useClassesStore } from '@stores/classes';
import { createClass, type CreateClassPayload } from '@api/classes';
import ClassesListItem from '@components/classes/ClassesListItem.vue';
import Modal from '@components/base/Modal.vue';
import ClassForm from '@components/forms/ClassForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const classesStore = useClassesStore();

const searchQuery = ref('');
const isViewingArchived = ref(false);
const showCreateModal = ref(false);
const createLoading = ref(false);
const createErrors = ref<string[]>([]);

const toggleArchivedView = async () => {
  isViewingArchived.value = !isViewingArchived.value;
  const institutionId = authStore.user?.institution.id;
  if (institutionId) {
    await classesStore.fetchClasses(isViewingArchived.value);
  } else {
    router.push('/auth');
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
    await classesStore.fetchClasses();
  } else {
    router.push('/auth');
  }
});

const toggleCreateModal = (value: boolean) => {
  showCreateModal.value = value;
};

const confirmCreate = async (formData: CreateClassPayload) => {
  createLoading.value = true;
  createErrors.value = [];

  const institutionId = authStore.user?.institution.id;
  if (!institutionId) {
    createErrors.value.push('Session invalide. Veuillez vous reconnecter.');
    createLoading.value = false;
    return;
  }

  try {
    const createdClass = await createClass({
      name: formData.name,
      studentCount: formData.studentCount,
      studentEmails: formData.studentEmails,
      description: formData.description || undefined,
    });

    await classesStore.fetchClasses(isViewingArchived.value);

    toggleCreateModal(false);
    router.push('/classes/' + createdClass.id + '/subjects/new');
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.message) {
      if (Array.isArray(error.response.data.message)) {
        createErrors.value.push(...error.response.data.message);
      } else {
        createErrors.value.push(error.response.data.message);
      }
    } else {
      createErrors.value.push('Une erreur est survenue lors de la création de la classe.');
    }
  } finally {
    createLoading.value = false;
  }
};
</script>

<template>
  <div class="page" :style="{ gap: hasClasses || (!hasClasses && isViewingArchived) ? '32px' : undefined }">
    <Header :disabled="!hasClasses && !isViewingArchived" />
    <TrialBanner v-if="authStore.user?.subscription?.plan === 'Izzzi'" />

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
              v-model="searchQuery"
              class="search-input"
              icon-right="Search"
              placeholder="Rechercher une classe..."
              @update:modelValue="searchQuery"
            />
          </div>
        </div>
        <Button v-if="!isViewingArchived" icon="Plus" iconPosition="right" @click="toggleCreateModal(true)">
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

      <Button variant="plain" icon="Arrow" iconPosition="right" @click="toggleArchivedView">
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
      <Button icon="Arrow" iconPosition="right" @click="toggleCreateModal(true)">Je créé une classe</Button>
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

      <Button variant="plain" icon="Arrow" iconPosition="right" @click="toggleArchivedView">
        Voir les classes actives
      </Button>
    </div>

    <Modal :isOpen="showCreateModal" title="Nouvelle classe" @close="toggleCreateModal(false)">
      <ClassForm
        submitLabel="Créer la classe"
        :loading="createLoading"
        :externalErrors="createErrors"
        @submit="confirmCreate"
        @cancel="toggleCreateModal(false)"
      />
    </Modal>
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
