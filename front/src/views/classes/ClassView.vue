<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const searchQuery = ref('');

const tableColumns = [
  { key: 'subject', label: 'Matière' },
  { key: 'surveysLinks', label: 'Liens des formulaires' },
  { key: 'qrCode', label: 'Code QR' },
  { key: 'actions', label: 'Retours' },
];

const tableRows = ref([
  { subject: 'Mathématiques', surveysLinks: '-', qrCode: '-', actions: '-' },
  { subject: 'Histoire', surveysLinks: '-', qrCode: '-', actions: '-' },
]);
</script>

<template>
  <div class="page">
    <Header />

    <div class="page-content">
      <div class="page-header">
        <div class="details-search">
          <div class="details">
            <h3>5IWJ</h3>
            <p>25 étudiants</p>
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
        <Button variant="neutral" icon="Plus" iconPosition="right" @click="router.push('/subjects/new')"
          >Ajouter une matière</Button
        >
      </div>

      <Table :columns="tableColumns" :rows="tableRows" striped>
        <template #cell-subject="{ row }">
          <div class="subject-cell">
            <div class="subject-details">
              <div class="subject-name-teacher">
                <p>UI Design</p>
                <p class="subject-teacher">Kathleen Alcini</p>
              </div>
              <p class="subject-dates">21/01/2024 - 21/01/2025</p>
            </div>
            <Button icon="Arrow" iconPosition="right" width="fit">Modifier le formulaire</Button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<style scoped>
.page {
  gap: 32px;
}

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
