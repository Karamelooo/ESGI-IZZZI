<script lang="ts" setup>
import type { FormTemplate } from '@api/forms';

defineProps<{
  template: FormTemplate;
  selected: boolean;
}>();
</script>

<template>
  <Card :padding="0" :fullWidth="true" :flexDirection="'row'">
    <div class="form-template" :class="{ 'form-template--selected': selected }">
      <div class="form-template-icon">
        <Icon name="Eyes" />
      </div>
      <div class="form-template-details">
        <h3>{{ template.name }}</h3>
        <p>{{ template.description }}</p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.form-template {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: var(--gray-2);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.form-template:hover {
  background-color: var(--gray-5);
  transition: background-color 0.2s ease-in-out;
}

.form-template--selected {
  background-color: var(--primary);
}

.form-template--selected:hover {
  background-color: var(--primary);
}

.form-template-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 8px;
  background-color: var(--white);
}

.form-template-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-template-details h3 {
  font-size: 16px;
  font-weight: 400;
}

.form-template-details p {
  font-size: 14px;
}
</style>
