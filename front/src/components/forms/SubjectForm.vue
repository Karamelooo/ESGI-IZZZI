<script lang="ts" setup>
import { ref, computed, toRefs, watch } from 'vue';
import FormErrors from '@components/FormErrors.vue';

interface SubjectFormData {
  name: string;
  instructorName: string;
  instructorEmail: string;
  startDate: string;
  endDate: string;
  classId: number | null;
}

interface Props {
  initialData?: Partial<SubjectFormData>;
  loading?: boolean;
  externalErrors?: string[];
  submitLabel?: string;
  informationLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  loading: false,
  externalErrors: () => [],
  submitLabel: 'Valider',
});

const { initialData } = toRefs(props);
const emit = defineEmits<{
  (e: 'submit', payload: SubjectFormData): void;
  (e: 'cancel'): void;
}>();

const nameInput = ref('');
const instructorNameInput = ref('');
const instructorEmailInput = ref('');
const startDateInput = ref('');
const endDateInput = ref('');
const classIdInput = ref<number | null>(null);

const formErrors = ref<string[]>([]);

watch(
  initialData,
  (newData) => {
    if (newData) {
      nameInput.value = newData.name || '';
      instructorNameInput.value = newData.instructorName || '';
      instructorEmailInput.value = newData.instructorEmail || '';
      startDateInput.value = newData.startDate || '';
      endDateInput.value = newData.endDate || '';
      classIdInput.value = newData.classId || null;
    }
  },
  { immediate: true }
);

const allErrors = computed(() => {
  return [...formErrors.value, ...props.externalErrors];
});

function onSubmit(event: Event) {
  event.preventDefault();
  if (props.loading) return;

  formErrors.value = [];

  emit('submit', {
    name: nameInput.value,
    instructorName: instructorNameInput.value,
    instructorEmail: instructorEmailInput.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    classId: classIdInput.value,
  });
}
</script>

<template>
  <form class="form" @submit="onSubmit">
    <div class="form-row">
      <Input
        v-model="nameInput"
        type="text"
        label="Nom de la matière"
        name="name"
        placeholder="Entrez le nom de la matière"
        :required="true"
      />

      <Input
        v-model="instructorNameInput"
        type="text"
        label="Nom de l'intervenant"
        name="instructorName"
        placeholder="Entrez le nom de l'intervenant"
        :required="true"
      />
    </div>

    <Input
      v-model="instructorEmailInput"
      type="email"
      label="Email de l'intervenant (facultatif)"
      name="instructorEmail"
      placeholder="Entrez l'email de l'intervenant"
    />

    <div class="form-row">
      <Input
        v-model="startDateInput"
        type="date"
        label="Date du premier cours (facultatif)"
        name="startDate"
        placeholder="JJ/MM/AAAA"
      />

      <Input
        v-model="endDateInput"
        type="date"
        label="Date du dernier cours (facultatif)"
        name="endDate"
        placeholder="JJ/MM/AAAA"
      />
    </div>

    <div v-if="informationLabel" class="form-info">
      <Icon name="Info-Desktop" />
      <span>{{ informationLabel }}</span>
    </div>

    <FormErrors :messages="allErrors" />

    <div class="form-actions">
      <Button icon="Arrow" iconPosition="right" :disabled="loading" type="submit">{{ submitLabel }}</Button>
    </div>
  </form>
</template>

<style scoped>
.form-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
