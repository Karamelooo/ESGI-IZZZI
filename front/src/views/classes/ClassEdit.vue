<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchClass, updateClass, type CreateClassPayload } from '@/api/classes';
import { isAxiosError } from 'axios';
import ClassForm from '@/components/forms/ClassForm.vue';

const route = useRoute();
const router = useRouter();
const loadingState = ref(false);
const initialLoading = ref(true);
const errorMessages = ref<string[]>([]);
const initialData = ref<Partial<CreateClassPayload>>({});

const classId = route.params.id as string;

onMounted(async () => {
  try {
    const classData = await fetchClass(classId);
    initialData.value = {
      name: classData.name,
      studentCount: classData.studentCount,
      studentEmails: classData.studentEmails,
      description: classData.description,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      router.push('/classes');
    } else {
      errorMessages.value.push('Impossible de charger les données de la classe');
    }
  } finally {
    initialLoading.value = false;
  }
});

async function onSubmit(formData: CreateClassPayload) {
  if (loadingState.value) return;

  loadingState.value = true;
  errorMessages.value = [];

  try {
    await updateClass(classId, {
      name: formData.name,
      studentCount: formData.studentCount,
      studentEmails: formData.studentEmails,
      description: formData.description || undefined,
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
        errorMessages.value.push('Une erreur est survenue lors de la modification de la classe');
      }
    } else {
      errorMessages.value.push('Une erreur inattendue est survenue');
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
        v-if="!initialLoading"
        submitLabel="Modifier la classe"
        :loading="loadingState"
        :externalErrors="errorMessages"
        :initialData="initialData"
        :isEdit="true"
        @submit="onSubmit"
        @cancel="router.push('/classes')"
      />
    </Card>
  </div>
</template>

<style scoped></style>
