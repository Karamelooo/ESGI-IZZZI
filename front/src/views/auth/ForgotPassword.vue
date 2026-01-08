<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/api/axios';
import { useToast } from '@composables/useToast';

const router = useRouter();
const api = useApi();
const toast = useToast();

const isFormSubmitted = ref(false);
const emailInput = ref('');
const loading = ref(false);

async function handleSubmit() {
  if (isFormSubmitted.value || loading.value) return;
  if (!emailInput.value) {
    toast.negative('Erreur', 'Veuillez renseigner votre email.');
    return;
  }

  loading.value = true;
  try {
    await api.post('/auth/forgot-password', { email: emailInput.value });
    isFormSubmitted.value = true;
  } catch (e) {
    console.error(e);
    toast.negative('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push('/auth');
}
</script>

<template>
  <main class="auth-main">
    <Logo :size="130" />

    <Card>
      <form v-if="!isFormSubmitted" class="form">
        <span class="title">Mot de passe oublié</span>

        <Input
          v-model="emailInput"
          type="email"
          label="Adresse email"
          name="email"
          placeholder="Entrez votre email"
          :required="true"
        />

        <Button icon="Arrow" iconPosition="right" :disabled="loading" @click="handleSubmit">
          {{ loading ? 'Envoi...' : 'Réinitialiser' }}
        </Button>
      </form>

      <form v-else class="form">
        <span class="title">📩 Email de réinitialisation envoyé !</span>

        <p class="description">
          Vérifiez votre boîte de réception (et votre dossier spam au cas où) ! Nous vous avons envoyé un email avec un
          lien pour réinitialiser votre mot de passe.
        </p>

        <p class="description">Si vous ne recevez rien, essayez à nouveau ou contactez notre support. 😊</p>

        <Button icon="Arrow" iconPosition="right" @click="goToLogin">Retour à la connexion</Button>
      </form>
    </Card>
  </main>
</template>

<style scoped>
.title {
  font-family: 'Mochiy Pop One';
  font-size: 18px;
}

.description {
  line-height: 1.5;
}
</style>
