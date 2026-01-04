<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { fetchFormTemplates, createSubjectForms } from '@api/forms';
import type { FormTemplate as FormTemplateType } from '@api/forms';
import FormTemplate from './FormTemplate.vue';
import FormTemplatePreview from './FormTemplatePreview.vue';

const props = defineProps<{
  isOpen: boolean;
  subjectId: number | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const modalTitle = ref('Deux moments clés pour recueillir les retours des étudiants.');

const templates = ref<FormTemplateType[]>([]);
const selectedTemplateId = ref<number | null>(null);
const selectedTemplate = computed(() => templates.value.find((t) => t.id === selectedTemplateId.value) as any);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    templates.value = await fetchFormTemplates();
    const firstTemplate = templates.value[0];
    if (firstTemplate) {
      selectedTemplateId.value = firstTemplate.id;
    }
  } catch (e) {
    error.value = 'Impossible de charger les modèles de formulaire.';
  }
});

const handleConfirm = async () => {
  if (!selectedTemplateId.value || !props.subjectId) return;

  loading.value = true;
  error.value = null;

  try {
    await createSubjectForms({
      subjectId: props.subjectId,
      templateId: selectedTemplateId.value,
    });
    emit('confirm');
    emit('close');
  } catch (e) {
    error.value = 'Une erreur est survenue lors de la création des formulaires.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Modal :isOpen="isOpen" :title="modalTitle" confirmText="Valider" @confirm="handleConfirm" @close="emit('close')">
    <div class="afm-modal">
      <div class="afm-header">
        <div class="afm-header-details">
          <Icon name="Clock" />
          <p><span>Pendant le cours :</span> pour recueillir des retours à chaud.</p>
        </div>

        <div class="afm-header-details">
          <Icon name="Check-Desktop" />
          <p><span>À la fin du cours :</span> pour évaluer l'ensemble du cours.</p>
        </div>
      </div>

      <div class="afm-content">
        <div class="afm-templates-list">
          <FormTemplate
            v-for="template in templates"
            :key="template.id"
            :template="template"
            :selected="template.id === selectedTemplateId"
            @click="selectedTemplateId = template.id"
          />
        </div>

        <div class="afm-preview-container">
          <FormTemplatePreview :template="selectedTemplate" />
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.afm-modal {
  width: 75vw;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.afm-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.afm-header-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.afm-header p {
  font-size: 14px;
}

.afm-header span {
  font-weight: 600;
}

.afm-content {
  width: 100%;
  display: flex;
  gap: 20px;
  flex: 1;
}

.afm-templates-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.afm-preview-container {
  flex: 2;
  height: 100%;
}

.form-template-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--gray-2);
  border: 1px solid var(--gray-15);
}
</style>
