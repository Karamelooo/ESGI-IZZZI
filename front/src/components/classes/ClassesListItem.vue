<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useClassesStore, type Class } from '@stores/classes';
import { toDateFR } from '@utils/date';

defineProps<{
  classItem: Class;
  isArchived?: boolean;
}>();

const router = useRouter();
const classesStore = useClassesStore();

const handleView = (classId: number) => {
  router.push('/classes/' + classId);
};

const handleEdit = (classId: number) => {
  router.push('/classes/' + classId + '/edit');
};

const handleRemove = async (classId: number) => {
  if (confirm('Archiver cette classe ?')) {
    await classesStore.deleteClass(classId);
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
      <Button v-if="!isArchived" variant="plain" icon="Pen-Desktop" @click="handleEdit(classItem.id)">Modifier</Button>
      <Button v-if="!isArchived" variant="plain" @click="handleRemove(classItem.id)">Archiver</Button>
      <Button v-else variant="plain" icon="Eyes" @click="handleView(classItem.id)">Voir les détails</Button>
    </div>
  </Card>
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
