<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createClass } from '@/api/classes';
import { isAxiosError } from 'axios';
import FormErrors from '@components/FormErrors.vue';

const router = useRouter();
const headerActiveTab = ref(0);

const nameInput = ref('');
const studentCountInput = ref('');
const studentEmailsInput = ref('');
const descriptionInput = ref('');

const loadingState = ref(false);
const errorMessages = ref<string[]>([]);

async function onSubmit(event: Event) {
  event.preventDefault();
  if (loadingState.value) return;

  loadingState.value = true;
  errorMessages.value = [];

  try {
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
      errorMessages.value.push(`Adresses email invalides: ${invalidEmails.join(', ')}`);
      return;
    }

    const cleanEmailsString = validEmails.join(';');

    await createClass({
      name: nameInput.value,
      studentCount: Number(studentCountInput.value),
      studentEmails: cleanEmailsString,
      description: descriptionInput.value || undefined,
    });

    router.push('/classes');
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessages.value.push(...error.response.data.message);
        } else {
          errorMessages.value.push(error.response.data.message);
        }
      } else {
        errorMessages.value.push('Une erreur est survenue lors de la création de la classe.');
      }
    } else {
      errorMessages.value.push('Une erreur inattendue est survenue.');
    }
  } finally {
    loadingState.value = false;
  }
}
</script>

<template>
  <div class="page">
    <Header :activeTab="headerActiveTab" :disabled="true" />

    <Card :autoMargin="true">
      <form class="auth-form auth-form--centered" @submit="onSubmit">
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

        <FormErrors :messages="errorMessages" />

        <div class="auth-actions">
          <Button icon="Arrow" iconPosition="right" :disabled="loadingState" type="submit">Créer la classe</Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<style scoped></style>
