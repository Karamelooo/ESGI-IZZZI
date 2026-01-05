<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { FormTemplate } from '@api/forms';

const props = defineProps<{
  template?: FormTemplate | null;
}>();

const answers = ref<Record<number, any>>({});

watch(
  () => props.template,
  () => {
    answers.value = {};
  }
);

const orderedGroups = computed(() => {
  if (!props.template?.questionGroups) return [];
  return [...props.template.questionGroups].sort((a, b) => a.order - b.order);
});

const getQuestionsByGroupId = (groupId: number) => {
  if (!props.template?.questions) return [];
  return props.template.questions.filter((q) => q.groupId === groupId).sort((a, b) => a.order - b.order);
};

const formatOptions = (options?: string[]) => {
  if (!options) return [];
  return options.map((opt) => ({ label: opt, value: opt }));
};
</script>

<template>
  <Card v-if="template" :padding="24" :spacing="24" :fullWidth="true" class="template-preview">
    <div class="tp-header">
      <h3>{{ template.name }}</h3>
      <p>{{ template.description }}</p>
    </div>

    <hr />

    <div class="tp-groups">
      <div v-for="group in orderedGroups" :key="group.id" class="tp-group">
        <div class="tp-group-header">
          <h3>{{ group.name }}</h3>
          <p v-if="group.description">{{ group.description }}</p>
        </div>

        <div class="tp-questions">
          <div v-for="question in getQuestionsByGroupId(group.id)" :key="question.id" class="tp-question">
            <Input v-if="question.type === 'SHORT_TEXT'" :label="question.label" v-model="answers[question.id]" />

            <Input
              v-else-if="question.type === 'LONG_TEXT'"
              :label="question.label"
              type="textarea"
              v-model="answers[question.id]"
            />

            <div v-else-if="question.type === 'SINGLE_CHOICE'" class="tp-question-field">
              <label class="input-label">{{ question.label }}</label>
              <RadioGroup
                :options="formatOptions(question.options)"
                name="preview-radio"
                v-model="answers[question.id]"
              />
            </div>

            <div v-else-if="question.type === 'MULTIPLE_CHOICE'" class="tp-question-field">
              <label class="input-label">{{ question.label }}</label>
              <CheckBoxGroup :options="formatOptions(question.options)" v-model="answers[question.id]" />
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </Card>

  <Card v-else :padding="0" :spacing="16" :fullWidth="true" :centered="true" class="afm-template-preview-placeholder">
    <div class="form-template-icon">
      <Icon name="Eyes" />
    </div>
    <h3>Sélectionnez un modèle<br />pour le prévisualiser.</h3>
  </Card>
</template>

<style scoped>
.template-preview {
  overflow-y: auto;
  max-height: 600px;
}

.tp-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tp-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.tp-header p {
  font-size: 14px;
}

.tp-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tp-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tp-group hr {
  margin: 4px 0px;
}

.tp-group-header {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.tp-group-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.tp-group-header p {
  font-size: 12px;
  font-weight: 500;
}

.tp-questions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tp-question-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
}

.afm-template-preview-placeholder {
  height: 100%;
  min-height: 400px;
}

.afm-template-preview-placeholder h3 {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
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
