<script lang="ts" setup>
import { ref, watch, toRefs, computed } from 'vue';
import FormErrors from '@components/FormErrors.vue';

interface ClassFormData {
  name: string;
  studentCount: number;
  studentEmails: string;
  description: string;
}

interface Props {
  initialData?: Partial<ClassFormData>;
  loading?: boolean;
  externalErrors?: string[];
  submitLabel?: string;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  loading: false,
  externalErrors: () => [],
  submitLabel: 'Valider',
  isEdit: false,
});

const emit = defineEmits<{
  (e: 'submit', payload: ClassFormData): void;
  (e: 'cancel'): void;
}>();

const { initialData } = toRefs(props);

const nameInput = ref('');
const studentCountInput = ref<string | number>('');
const studentEmailsInput = ref('');
const descriptionInput = ref('');

const formErrors = ref<string[]>([]);

watch(
  initialData,
  (newData) => {
    if (newData) {
      nameInput.value = newData.name || '';
      studentCountInput.value = newData.studentCount || '';
      studentEmailsInput.value = newData.studentEmails || '';
      descriptionInput.value = newData.description || '';
    }
  },
  { immediate: true }
);

const allErrors = computed(() => {
  return [...formErrors.value, ...props.externalErrors];
});

async function onSubmit(event: Event) {
  event.preventDefault();
  if (props.loading) return;

  formErrors.value = [];

  const rawEmails = studentEmailsInput.value.split(';');
  const validEmails: string[] = [];
  const invalidEmails: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const rawEmail of rawEmails) {
    const email = rawEmail.trim();
    if (!email) continue;

    if (emailRegex.test(email)) {
      validEmails.push(email);
    } else {
      invalidEmails.push(email);
    }
  }

  if (invalidEmails.length > 0) {
    formErrors.value.push(`Adresses email invalides: ${invalidEmails.join(', ')}`);
    return;
  }

  const cleanEmailsString = validEmails.join(';');

  emit('submit', {
    name: nameInput.value,
    studentCount: Number(studentCountInput.value),
    studentEmails: cleanEmailsString,
    description: descriptionInput.value,
  });
}

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form class="form form--centered" @submit="onSubmit">
    <Input
      v-model="nameInput"
      type="text"
      label="Nom de la classe"
      name="name"
      placeholder="Entrez le nom de la classe"
      :rules="[
        { type: 'minLength', value: 1 },
        { type: 'maxLength', value: 50 },
      ]"
      :required="true"
    />

    <Input
      v-model="studentCountInput"
      type="number"
      label="Nombre d'étudiants"
      name="studentCount"
      placeholder="Entrez le nombre d'étudiants"
      :required="true"
    />

    <Input
      v-model="studentEmailsInput"
      type="textarea"
      label="Adresses mail des étudiants"
      name="studentEmails"
      placeholder="Entrez les adresses mail des étudiants séparées par des points-virgules"
      :required="true"
    />

    <Input
      v-model="descriptionInput"
      type="text"
      label="Description (facultative)"
      name="description"
      placeholder="Entrez une description (spé, rythme...)"
      :rules="[{ type: 'maxLength', value: 50 }]"
    />

    <FormErrors :messages="allErrors" />

    <div class="auth-actions">
      <Button icon="Arrow" iconPosition="right" type="submit" :disabled="loading">{{ submitLabel }}</Button>
      <Button variant="neutral" type="button" :disabled="loading" @click="onCancel">Annuler</Button>
    </div>
  </form>
</template>
