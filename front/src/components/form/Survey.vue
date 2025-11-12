<script lang="ts" setup>
import Input from '../base/Input.vue';
import RadioGroup from './RadioGroup.vue';
import CheckBoxGroup from './CheckBoxGroup.vue';
import type { Question } from '../../types/survey';
import { computed } from 'vue';

const props = defineProps<{
  questions: Question[];
  modelValue?: Record<number, string | string[]>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<number, string | string[]>): void;
}>();

const responses = computed({
  get: () => props.modelValue ?? {},
  set: (v) => emit('update:modelValue', v),
});

function setAnswer(id: number, value: string | string[]) {
  const next = { ...(responses.value ?? {}) };
  next[id] = value;
  responses.value = next;
}

function formatOptions(options: string[]) {
  return options.map((label) => ({ value: label, label }));
}

function generateScaleOptions(min: number, max: number) {
  const arr: { value: string; label: string }[] = [];
  for (let i = min; i <= max; i++) arr.push({ value: String(i), label: String(i) });
  return arr;
}
</script>

<template>
  <div v-for="q in questions" :key="q.id" class="question-item">
    <label class="question-label"
      ><h3>{{ q.label }}</h3></label
    >

    <Input
      v-if="q.type === 'text'"
      :type="'textarea'"
      :model-value="(responses[q.id] as string) ?? ''"
      @update:model-value="(v) => setAnswer(q.id, v)"
      :label="q.label"
      :placeholder="q.placeholder"
      :required="q.required"
    />

    <RadioGroup
      v-else-if="q.type === 'choice' && !q.multiple"
      :model-value="(responses[q.id] as string) ?? ''"
      @update:model-value="(v) => setAnswer(q.id, v)"
      :options="formatOptions(q.options)"
      :name="`question-${q.id}`"
    />

    <CheckBoxGroup
      v-else-if="q.type === 'choice' && q.multiple"
      :model-value="(responses[q.id] as string[]) ?? []"
      @update:model-value="(v) => setAnswer(q.id, v)"
      :options="formatOptions(q.options)"
      :name="`question-${q.id}`"
    />

    <RadioGroup
      v-else-if="q.type === 'scale'"
      :model-value="(responses[q.id] as string) ?? ''"
      @update:model-value="(v) => setAnswer(q.id, v)"
      :options="generateScaleOptions(q.min, q.max)"
      :name="`question-${q.id}`"
    />
  </div>
</template>

<style scoped>
.survey-card h3 {
  padding-bottom: 1rem;
}
</style>
