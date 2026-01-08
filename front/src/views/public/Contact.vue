<script lang="ts" setup>
import { ref } from 'vue';
import { useApi } from '@/api/axios';
import { useToast } from '@composables/useToast';
import { useRouter } from 'vue-router';
import Input from '@components/base/Input.vue';
import Button from '@components/base/Button.vue';
import CheckBoxGroup from '@components/base/CheckBoxGroup.vue';
import Footer from '@/components/page/Footer.vue';

const api = useApi();
const toast = useToast();
const router = useRouter();

const form = ref({
  institutionName: '',
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  approximateClasses: 22,
  message: '',
  callbackRequested: false,
});

const loading = ref(false);
const submitted = ref(false);

const callbackOption = [{ label: 'Je souhaite être rappelé(e) par un membre de l\'équipe', value: 'true' }];
const callbackValue = ref([]);

const submit = async () => {
  loading.value = true;
  try {
    form.value.callbackRequested = callbackValue.value.length > 0;
    await api.post('/contact', form.value);
    submitted.value = true;
  } catch (e) {
    console.error(e);
    toast.negative('Erreur', 'Une erreur est survenue lors de l\'envoi de votre demande.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <div class="contact-container">
      <div v-if="!submitted" class="form-container">
        <div class="contact-header">
          <h1>Votre établissement dépasse nos formules standards ?</h1>
          <p>L'équipe Izzzi vous accompagne pour créer une offre adaptée à votre nombre de classes, à vos besoins spécifiques ou à vos exigences administratives.</p>
        </div>

        <div class="contact-card">
          <div class="form">
            <Input
              v-model="form.institutionName"
              label="École ou organisme"
              placeholder="Izzzi School"
              required
            />

            <div class="row">
              <Input
                v-model="form.lastName"
                label="Nom"
                placeholder="Doe"
                required
              />
              <Input
                v-model="form.firstName"
                label="Prénom"
                placeholder="John"
                required
              />
            </div>

            <Input
              v-model="form.email"
              type="email"
              label="Email professionnel"
              placeholder="hello@izzzi.io"
              required
            />

            <Input
              v-model="form.phone"
              type="tel"
              label="Téléphone (pour rappel)"
              placeholder="06 00 00 00 00"
            />

            <Input
              v-model.number="form.approximateClasses"
              type="number"
              label="Nombre approximatif de classes / étudiants"
              placeholder="22"
              required
            />

            <div class="input-wrapper">
              <label>Votre message</label>
              <textarea
                v-model="form.message"
                placeholder="Décrivez brièvement vos besoins"
                rows="5"
              ></textarea>
            </div>

            <CheckBoxGroup
              v-model="callbackValue"
              :options="callbackOption"
              label-position="right"
            />

            <Button
              icon="Arrow"
              iconPosition="right"
              :disabled="loading"
              @click="submit"
            >
              {{ loading ? 'Envoi en cours...' : 'Envoyer ma demande' }}
            </Button>
          </div>
        </div>
      </div>

      <div v-else class="success-container">
        <h1>Merci pour votre message</h1>
        <p>Nous vous recontactons sous 24h ouvrées pour échanger sur vos besoins et vous proposer une offre adaptée.</p>
        <Button
          icon="Arrow"
          iconPosition="right"
          @click="router.push('/')"
        >
          Retourner à l'accueil
        </Button>
      </div>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
main {
  margin: 10rem 1rem 5rem 1rem;
  display: flex;
  justify-content: center;
}

.contact-container {
  max-width: 800px;
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2rem;
  padding: 5rem 2rem;
}

.success-container h1 {
  font-size: 4rem;
  font-weight: 800;
  color: var(--black);
}

.success-container p {
  font-size: 1.5rem;
  color: var(--gray-60);
  max-width: 600px;
  line-height: 1.5;
}

.contact-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
}

.contact-header p {
  color: var(--gray-60);
  line-height: 1.6;
  max-width: 600px;
  margin:auto;
}

.contact-card {
  background: var(--white);
  border: 1px solid var(--gray-15);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper label {
  font-weight: 600;
  color: var(--black);
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--gray-15);
  border-radius: 12px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: var(--orange);
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
  
  .contact-card {
    padding: 2rem;
  }

  .contact-header h1 {
    font-size: 1.8rem;
  }
}
</style>
