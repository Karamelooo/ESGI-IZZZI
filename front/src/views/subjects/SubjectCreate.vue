<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isAxiosError } from 'axios';
import { createSubject } from '@api/subjects';
import { toIsoDate } from '@utils/date';
import SubjectForm from '@components/forms/SubjectForm.vue';

const router = useRouter();
const route = useRoute();

const loadingState = ref(false);
const errorMessages = ref<string[]>([]);

async function onSubmit(formData: any) {
  if (loadingState.value) return;

  const classId = Number(route.params.id);
  if (!classId) {
    errorMessages.value = ['Erreur lors de la récupération de la classe.'];
    return;
  }

  loadingState.value = true;
  errorMessages.value = [];

  try {
    await createSubject({
      name: formData.name,
      instructorName: formData.instructorName,
      instructorEmail: formData.instructorEmail || undefined,
      startDate: formData.startDate ? toIsoDate(formData.startDate) : undefined,
      endDate: formData.endDate ? toIsoDate(formData.endDate) : undefined,
      classId: classId,
    });

    router.push(`/classes/${classId}`);
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessages.value.push(...error.response.data.message);
        } else {
          errorMessages.value.push(error.response.data.message);
        }
      } else {
        errorMessages.value.push('Une erreur est survenue lors de la création de la matière.');
      }
    } else {
      errorMessages.value.push('Une erreur inattendue est survenue.');
    }
  } finally {
    loadingState.value = false;
  }
}

function handleGoBack() {
  router.push(`/classes/${route.params.id}`);
}
</script>

<template>
  <div class="page">
    <Header />

    <div class="go-back-wrapper">
      <Button variant="neutral" icon="Arrow" iconOnly flipHorizontal @click="handleGoBack"></Button>
      <Button variant="plain" @click="handleGoBack">Retour aux informations de la classe</Button>
    </div>

    <div class="page-wrapper">
      <div class="forms-wrapper">
        <Card :spacing="20" fullWidth>
          <h3 class="form-title">Télécharger le CSV avec toutes les matières d'un coup.</h3>
          <p class="csv-help">Comment ça marche ? (1 minute)</p>
          <div class="csv-actions">
            <Button variant="neutral" icon="Import" iconPosition="right">Télécharger notre modèle CSV</Button>
            <Button variant="primary" icon="Download" iconPosition="right">Importer un fichier CSV</Button>
          </div>
        </Card>

        <Card :spacing="20" fullWidth>
          <h3 class="form-title">Ajouter les matières une par une.</h3>
          <SubjectForm
            submitLabel="Créer la matière"
            :loading="loadingState"
            :externalErrors="errorMessages"
            :hideClassSelector="true"
            @submit="onSubmit"
          />
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.go-back-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.go-back-wrapper button.button--plain {
  text-decoration: underline;
}

.page-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forms-wrapper {
  min-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.csv-help {
  font-size: 14px;
  text-decoration: underline;
}

.csv-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
