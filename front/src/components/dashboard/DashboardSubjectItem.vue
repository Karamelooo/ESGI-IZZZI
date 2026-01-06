<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Subject } from '@stores/subjects';

const props = defineProps<{
  subjectItem: Subject;
}>();

const router = useRouter();

const showAISynthesisModal = ref(false);

const toggleAISynthesisModal = (value: boolean) => {
  showAISynthesisModal.value = value;
};

const handleViewFeedback = (subjectId: number, formType: string) => {
  router.push('dashboard/feedbacks/' + subjectId + '/' + formType);
};

const handleRemindStudents = (subjectId: number, formType: string) => {
  console.log('Reminding students for subject ' + subjectId + ' and ' + formType + ' form...');
};
</script>

<template>
  <Card v-for="form in subjectItem.forms" :key="form.id" :fullWidth="true" :padding="36" class="dashboard-subject-item">
    <div class="dsi-header">
      <div class="dsi-details">
        <div class="dsi-subject-details">
          <h3>{{ subjectItem.name }}</h3>
          <div class="dsi-subject-class-teacher">
            <p class="dsi-subject-class">{{ subjectItem.class.name }}</p>
            <p class="dsi-subject-teacher">{{ subjectItem.instructorName }}</p>
          </div>
        </div>

        <div class="dsi-form-type">
          <span v-if="form.type === 'DURING_COURSE'">Formulaire pendant le cours</span>
          <span v-if="form.type === 'AFTER_COURSE'">Formulaire fin de cours</span>
        </div>
      </div>

      <div class="dsi-counters">
        <div class="dsi-counter">
          <p>Retours</p>
          <span>17</span>
        </div>
        <div class="dsi-counter">
          <p>Score</p>
          <span>7,8</span>
        </div>
      </div>
    </div>

    <div class="dsi-content">
      <div class="dsi-content-left">
        <div class="dsi-section-header">
          <Icon name="Notes" />
          <p>Synthèse des retours</p>
        </div>
        <p>
          Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms.
          Lasagna.
        </p>
        <Button variant="plain" @click="toggleAISynthesisModal(true)">Voir plus</Button>
      </div>

      <div class="dsi-content-right">
        <div class="dsi-section-header">
          <p>En essai jusqu'au 25 septembre. Retours visibles en anonyme sur le plan gratuit.</p>
        </div>

        <Button
          variant="primary"
          icon="Arrow"
          iconPosition="right"
          @click="handleViewFeedback(subjectItem.id, form.type.toLowerCase())"
        >
          Voir les retours
        </Button>

        <Button
          variant="plain"
          icon="Reload"
          iconPosition="right"
          @click="handleRemindStudents(subjectItem.id, form.type.toLowerCase())"
        >
          Relancer les étudiants
        </Button>
      </div>
    </div>
  </Card>

  <Modal
    :isOpen="showAISynthesisModal"
    title="Synthèse des retours"
    cancelText="Fermer"
    cancelVariant="plain"
    @close="toggleAISynthesisModal(false)"
    class="ai-synthesis-modal"
  >
    <p>
      Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms. Lasagna.
    </p>
  </Modal>
</template>

<style scoped>
.dsi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 72px;
}

.dsi-details {
  display: flex;
  align-items: center;
  gap: 24px;
}

.dsi-subject-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dsi-subject-details h3 {
  font-size: 18px;
  font-weight: 400;
}

.dsi-subject-class-teacher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dsi-subject-class {
  font-size: 16px;
  font-weight: 700;
}

.dsi-subject-teacher {
  font-size: 14px;
  font-weight: 400;
}

.dsi-form-type {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--blue);
  color: var(--gray-100);
  background-color: color-mix(in srgb, var(--blue), transparent 80%);
}

.dsi-counters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dsi-counter {
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 8px 12px;
  border-radius: 999px;
  background-color: var(--beige);
}

.dsi-counter p {
  margin-left: 4px;
}

.dsi-counter span {
  padding: 6px 10px;
  border-radius: 999px;
  background-color: var(--primary);
}

.dsi-content {
  display: flex;
  gap: 72px;
}

.dsi-content-left,
.dsi-content-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dsi-content-right {
  min-width: 244px;
  max-width: 244px;
}

.dsi-content-left button {
  font-size: 12px;
  text-decoration: underline;
}

.dsi-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dsi-section-header p {
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-100);
}

.ai-synthesis-modal p {
  max-width: 500px;
}

@media (min-width: 1280px) {
  .dsi-details {
    flex-direction: column;
  }
}

@media (min-width: 1650px) {
  .dsi-details {
    flex-direction: row;
  }
}
</style>
