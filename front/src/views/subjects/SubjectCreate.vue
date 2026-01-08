<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isAxiosError } from 'axios';
import { createSubject, createSubjectsBulk } from '@api/subjects';
import { toIsoDate } from '@utils/date';
import SubjectForm from '@components/forms/SubjectForm.vue';
import Header from '@components/page/Header.vue';
import Button from '@components/base/Button.vue';
import Card from '@components/layout/Card.vue';
import Modal from '@components/base/Modal.vue';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const loadingState = ref(false);
const errorMessages = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const showHelpModal = ref(false);

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

function handleDownloadTemplate() {
  const csvContent = "Nom,Formateur,Email Formateur,Date de début,Date de fin\nMathématiques,Jean Dupont,jean.dupont@email.com,01/09/2025,30/06/2026";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "modele_matieres.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function triggerFileUpload() {
  fileInput.value?.click();
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target?.result as string;
    await processCsv(text);
  };
  reader.readAsText(file);
  
  target.value = '';
}

async function processCsv(text: string) {
  loadingState.value = true;
  errorMessages.value = [];
  
  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) {
      toast.negative('Le fichier est vide ou mal formaté.');
      return;
    }

    const subjects: any[] = [];
    const classId = Number(route.params.id);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      
      const values = line.split(',');
      if (values.length < 2) continue;

      const [name, instructorName, instructorEmail, startDateStr, endDateStr] = values;

      if (!name || !instructorName) continue;

      subjects.push({
        name: name.trim(),
        instructorName: instructorName.trim(),
        instructorEmail: instructorEmail?.trim() || undefined,
        startDate: startDateStr ? parseCsvDate(startDateStr) : undefined,
        endDate: endDateStr ? parseCsvDate(endDateStr) : undefined,
        classId,
      });
    }

    if (subjects.length === 0) {
      toast.negative('Aucune matière valide trouvée dans le CSV.');
      return;
    }

    await createSubjectsBulk(subjects);
    toast.success(`${subjects.length} matières créées avec succès.`);
    router.push(`/classes/${classId}`);
  } catch (error) {
    console.error(error);
    toast.negative("Erreur lors de l'import du CSV. Vérifiez le format (Dates: DD/MM/YYYY).");
  } finally {
    loadingState.value = false;
  }
}

function parseCsvDate(dateStr: string): string | undefined {
  if (!dateStr) return undefined;
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    if (!day || !month || !year) return undefined;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`;
  }
  return undefined;
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
          <p class="csv-help" @click="showHelpModal = true">Comment ça marche ? (1 minute)</p>
          <div class="csv-actions">
            <Button variant="neutral" icon="Import" iconPosition="right" @click="handleDownloadTemplate">Télécharger notre modèle CSV</Button>
            <Button variant="primary" icon="Download" iconPosition="right" :loading="loadingState" @click="triggerFileUpload">Importer un fichier CSV</Button>
            <input 
              ref="fileInput" 
              type="file" 
              accept=".csv" 
              style="display: none" 
              @change="handleFileUpload"
            />
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

    <Modal
      :isOpen="showHelpModal"
      title="Comment importer vos matières ?"
      confirmText="J'ai compris"
      @confirm="showHelpModal = false"
      @close="showHelpModal = false"
    >
      <div class="help-modal-content">
        <p>L'import CSV vous permet de gagner du temps en ajoutant toutes vos matières d'un coup.</p>
        
        <div class="help-step">
          <span class="step-number">1</span>
          <p>Téléchargez notre modèle CSV pour avoir la structure correcte.</p>
        </div>

        <div class="help-step">
          <span class="step-number">2</span>
          <p>Remplissez le fichier avec vos informations. Les colonnes obligatoires sont : <strong>Nom</strong> et <strong>Formateur</strong>.</p>
        </div>

        <div class="help-step">
          <span class="step-number">3</span>
          <p>Utilisez le format <strong>JJ/MM/AAAA</strong> pour les dates (ex: 01/09/2025).</p>
        </div>

        <div class="help-step">
          <span class="step-number">4</span>
          <p>Importez votre fichier complété pour créer toutes les matières d'un coup !</p>
        </div>

        <div class="help-note">
          <p><strong>Note :</strong> Veillez à ne pas modifier l'ordre des colonnes du modèle.</p>
        </div>
      </div>
    </Modal>
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
  cursor:pointer;
}

.csv-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.help-modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.help-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  background-color: var(--primary);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.help-note {
  padding: 12px;
  background-color: var(--gray-1);
  border-radius: 8px;
  font-size: 14px;
}
</style>
