<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useClassesStore, type Class } from '@stores/classes';
import { updateClass } from '@api/classes';
import { toDateFR } from '@utils/date';
import Modal from '../base/Modal.vue';
import ClassForm from '../forms/ClassForm.vue';

const props = defineProps<{
  classItem: Class;
  isArchived?: boolean;
}>();

const router = useRouter();
const authStore = useAuthStore();
const classesStore = useClassesStore();

const showEditModal = ref(false);
const showArchiveModal = ref(false);

const handleView = (classId: number) => {
  router.push('/classes/' + classId);
};

const toggleEditModal = (value: boolean) => {
  showEditModal.value = value;
};

const toggleArchiveModal = (value: boolean) => {
  showArchiveModal.value = value;
};

const confirmArchive = async () => {
  await classesStore.deleteClass(props.classItem.id);
  toggleArchiveModal(false);
};

const editLoading = ref(false);
const editErrors = ref<string[]>([]);

const editInitialData = computed(() => {
  return {
    name: props.classItem.name,
    studentCount: props.classItem.studentCount,
    studentEmails: props.classItem.studentEmails,
    description: props.classItem.description || '',
  };
});

const confirmEdit = async (formData: any) => {
  editLoading.value = true;
  editErrors.value = [];
  try {
    await updateClass(props.classItem.id, {
      name: formData.name,
      studentCount: formData.studentCount,
      studentEmails: formData.studentEmails,
      description: formData.description,
    });

    const institutionId = authStore.user?.institution.id;
    if (institutionId) {
      await classesStore.fetchClasses(institutionId);
    } else {
      router.push('/auth');
    }

    toggleEditModal(false);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message;
    if (errorMessage) {
      if (Array.isArray(errorMessage)) {
        editErrors.value.push(...errorMessage);
      } else {
        editErrors.value.push(errorMessage);
      }
    }
  } finally {
    editLoading.value = false;
  }
};
</script>

<template>
  <Card :fullWidth="true" :padding="20">
    <div class="class-header">
      <div class="class-details">
        <h3>{{ classItem.name }}</h3>
        <p>{{ classItem.description }}</p>
        <span class="semibold">{{ classItem.studentCount }} étudiants</span>
        <span v-if="isArchived && classItem.deletedAt" class="italic">
          Archivée le {{ toDateFR(classItem.deletedAt) }}
        </span>
      </div>

      <div class="class-link" @click="handleView(classItem.id)">
        <Button v-if="!isArchived" variant="plain">Voir les détails</Button>
        <Button icon="Arrow" :iconOnly="true"></Button>
      </div>
    </div>

    <div class="class-actions">
      <Button v-if="!isArchived" variant="plain" icon="Pen-Desktop" @click="toggleEditModal(true)">Modifier</Button>
      <Button v-if="!isArchived" variant="plain" @click="toggleArchiveModal(true)">Archiver</Button>
      <Button v-else variant="plain" icon="Eyes" @click="handleView(classItem.id)">Voir les détails</Button>
    </div>
  </Card>

  <Modal
    :isOpen="showArchiveModal"
    title="Archiver cette classe ?"
    confirmText="Archiver"
    cancelText="Annuler"
    confirmVariant="primary"
    cancelVariant="plain"
    @confirm="confirmArchive"
    @close="toggleArchiveModal(false)"
  >
    Cette classe ne sera plus modifiable ni restaurable,<br />mais restera consultable dans vos classes archivées.
  </Modal>

  <Modal :isOpen="showEditModal" title="Modifier la classe" @close="toggleEditModal(false)">
    <ClassForm
      :initialData="editInitialData"
      :loading="editLoading"
      :externalErrors="editErrors"
      submitLabel="Modifier"
      :isEdit="true"
      @submit="confirmEdit"
      @cancel="toggleEditModal(false)"
    />
  </Modal>
</template>

<style scoped>
.class-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
}

.class-header span {
  font-size: 10px;
}

.class-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.class-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.class-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: underline;
}
</style>
