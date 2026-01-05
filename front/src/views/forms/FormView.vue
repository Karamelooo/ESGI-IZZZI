<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPublicForm, submitFormResponse } from '@api/forms';

const route = useRoute();
const loading = ref(true);
const errorMessages = ref<string[]>([]);

const form = ref<any>(null);
const formAnswers = ref<Record<number, any>>({});
const studentEmail = ref('');
const globalRating = ref<string>('');

const showSuccessModal = ref(false);
const isSubmitted = ref(false);

const sortedGroups = computed(() => {
  if (!form.value?.template?.questionGroups) return [];
  return [...form.value.template.questionGroups].sort((a: any, b: any) => a.order - b.order);
});

const toggleSuccessModal = (value: boolean) => {
  showSuccessModal.value = value;
};

const getQuestionsByGroupId = (groupId: number) => {
  if (!form.value?.template?.questions) return [];
  return form.value.template.questions
    .filter((q: any) => q.groupId === groupId)
    .sort((a: any, b: any) => a.order - b.order);
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const submitForm = async () => {
  errorMessages.value = [];
  loading.value = true;

  if (!studentEmail.value || !validateEmail(studentEmail.value)) {
    errorMessages.value.push('Veuillez entrer une adresse email valide.');
    loading.value = false;
    return;
  }

  if (!globalRating.value) {
    errorMessages.value.push('Veuillez donner une note globale.');
    loading.value = false;
    return;
  }

  try {
    const answers = Object.entries(formAnswers.value).map(([key, value]) => ({
      questionId: parseInt(key),
      value: value,
    }));

    await submitFormResponse({
      studentEmail: studentEmail.value,
      globalRating: parseInt(globalRating.value),
      formId: form.value.id,
      answers,
    });

    isSubmitted.value = true;
    toggleSuccessModal(true);
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue lors de l'envoi du formulaire.");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const id = route.params.id as string;
    form.value = await fetchPublicForm(id);
  } catch (e) {
    errorMessages.value.push('Impossible de charger le formulaire.');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="public-form-view">
    <div class="pfv-sidebar">
      <Logo alt="Logo IZZZI" />
      <h1>{{ form?.subject?.name ?? 'Matière' }}</h1>

      <div class="pfv-class-details">
        <div class="pfv-class-detail">
          <Icon name="School" />
          <p>{{ form?.subject?.class?.institution?.name ?? 'École' }}</p>
        </div>

        <div class="pfv-class-detail-separator"></div>

        <div class="pfv-class-detail">
          <Icon name="People" />
          <p>{{ form?.subject?.class?.name ?? 'Classe' }}</p>
        </div>
      </div>

      <p>Sois honnête, sinon ça ne sert à rien !</p>
      <p>
        C'est grâce à vos retours que nous pouvons améliorer les interventions, et coller le plus possible à vos
        attentes.
      </p>

      <div v-if="errorMessages.length" class="pfv-error-messages">
        <p v-for="message in errorMessages" :key="message">{{ message }}</p>
      </div>

      <Button v-if="!isSubmitted" @click="submitForm" icon="Arrow" iconPosition="right" :disabled="loading">
        Envoyer
      </Button>
    </div>

    <div class="pfv-content">
      <div v-if="loading">
        <p>Chargement...</p>
      </div>

      <div v-else-if="isSubmitted">
        <Card :fullWidth="true" :centered="true" :spacing="16">
          <h3>Merci pour ton retour !</h3>
          <p>Tes réponses ont bien été enregistrées.</p>
        </Card>
      </div>

      <div v-else class="pfv-form-groups">
        <Card :fullWidth="true" :spacing="24">
          <h3>Globalement, vous avez trouvé ce cours...</h3>

          <div class="pfv-question-item">
            <RadioGroup
              v-model="globalRating"
              :options="[
                { label: 'Trop cool', value: '5' },
                { label: 'Bien', value: '4' },
                { label: 'Moyen', value: '3' },
                { label: 'Bof', value: '2' },
                { label: 'Nul', value: '1' },
              ]"
              name="global-rating"
              class="public-form-input"
            />
          </div>

          <div class="pfv-question-item" style="margin-top: 12px">
            <Input
              v-model="studentEmail"
              type="email"
              label="Votre email étudiant"
              placeholder="prenom.nom@esgi.fr"
              name="student-email"
              class="public-form-input"
            />
          </div>
        </Card>

        <Card v-for="group in sortedGroups" :key="group.id" :spacing="36" :fullWidth="true">
          <div class="pfv-group-header">
            <h3 class="pfv-group-name">{{ group.name }}</h3>
            <p v-if="group.description">{{ group.description }}</p>
          </div>

          <div class="pfv-group-questions">
            <div v-for="question in getQuestionsByGroupId(group.id)" :key="question.id" class="pfv-question-item">
              <h3>{{ question.label }}</h3>

              <RadioGroup
                v-if="question.type === 'SINGLE_CHOICE'"
                v-model="formAnswers[question.id]"
                :options="question.options?.map((opt: string) => ({ label: opt, value: opt })) || []"
                :name="`question-${question.id}`"
                class="public-form-input"
              />

              <CheckBoxGroup
                v-else-if="question.type === 'MULTIPLE_CHOICE'"
                v-model="formAnswers[question.id]"
                :options="question.options?.map((opt: string) => ({ label: opt, value: opt })) || []"
                :name="`question-${question.id}`"
                class="public-form-input"
              />

              <Input
                v-else-if="question.type === 'SHORT_TEXT' || question.type === 'LONG_TEXT'"
                v-model="formAnswers[question.id]"
                :type="question.type === 'LONG_TEXT' ? 'textarea' : 'text'"
                placeholder="Écris ta réponse ici..."
                :name="`question-${question.id}`"
                class="public-form-input"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>

  <Modal
    :isOpen="showSuccessModal"
    title="Réponses envoyées !"
    confirmText="Fermer"
    @confirm="toggleSuccessModal(false)"
    @close="toggleSuccessModal(false)"
  >
    <p>Merci d'avoir répondu à ce formulaire.</p>
  </Modal>
</template>

<style>
.public-form-view {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 0;
  display: flex;
  gap: 36px;
  position: relative;
}

.public-form-view .logo {
  margin-bottom: 24px;
}

.pfv-sidebar {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 48px;
  height: fit-content;
}

.pfv-sidebar h1 {
  font-size: 32px;
  font-weight: 400;
}

.pfv-sidebar p {
  line-height: 1.5;
}

.pfv-class-details {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid var(--gray-15);
}

.pfv-class-detail {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
}

.pfv-class-detail-separator {
  width: 1px;
  height: 100%;
  background-color: var(--gray-15);
}

.pfv-error-messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--error);
}

.pfv-content {
  flex: 1;
}

.pfv-content h3 {
  font-weight: 400;
}

.pfv-form-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pfv-group-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pfv-group-name {
  font-size: 32px;
  font-weight: 400;
}

.pfv-group-questions {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.pfv-question-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.public-form-input .radio-root,
.public-form-input .checkbox-root {
  gap: 12px;
}

.public-form-input .radio-label,
.public-form-input .checkbox-label {
  font-size: 16px;
}

.public-form-input input,
.public-form-input textarea {
  font-size: 15px;
}
</style>
