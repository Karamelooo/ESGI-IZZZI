<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@stores/auth';
import { createClass, type CreateClassPayload } from '@api/classes';
import ClassForm from '@components/forms/ClassForm.vue';

const router = useRouter();
const authStore = useAuthStore();

const loadingState = ref(false);
const errorMessages = ref<string[]>([]);

async function onSubmit(formData: CreateClassPayload) {
  if (loadingState.value) return;

  loadingState.value = true;
  errorMessages.value = [];

  const institutionId = authStore.user?.institution.id;
  if (!institutionId) {
    errorMessages.value.push('Session invalide. Veuillez vous reconnecter.');
    return;
  }

  try {
    const createdClass = await createClass({
      name: formData.name,
      studentCount: formData.studentCount,
      studentEmails: formData.studentEmails,
      description: formData.description || undefined,
    });

    router.push('/classes/' + createdClass.id + '/subjects/new');
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
    <Header />

    <Card :autoMargin="true">
      <ClassForm
        submitLabel="Créer la classe"
        :loading="loadingState"
        :externalErrors="errorMessages"
        @submit="onSubmit"
        @cancel="router.push('/classes')"
      />
    </Card>
  </div>
</template>

<style scoped></style>
