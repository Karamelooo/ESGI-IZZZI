<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Input from '@components/base/Input.vue';
import Button from '@components/base/Button.vue';
import { register } from '@api/auth.ts';
import { useAuthStore } from '@stores/auth';

const emit = defineEmits<{
  (e: 'login'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const institutionNameInput = ref('');
const emailInput = ref('');
const passwordInput = ref('');
const firstNameInput = ref('');
const lastNameInput = ref('');
const loadingState = ref(false);
const errorMessages = ref<string[]>([]);

async function onSubmit(event: Event) {
  event.preventDefault();
  loadingState.value = true;
  errorMessages.value = [];

  try {
    const data = await register({
      institutionName: institutionNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
    });

    authStore.setAccessToken(data.accessToken);

    loadingState.value = false;
    router.push('/classes');
  } catch (error: any) {
    loadingState.value = false;

    if (error?.response?.data?.message) {
      errorMessages.value = Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message];
    } else {
      errorMessages.value = ['Une erreur inconnue est survenue'];
    }
  }
}
</script>

<template>
  <form class="auth-form auth-form--centered" @submit="onSubmit">
    <Input
      v-model="institutionNameInput"
      type="text"
      label="Nom de l'établissement"
      name="institution-name"
      placeholder="Entrez le nom de l'établissement"
      :required="true"
    />

    <Input
      v-model="emailInput"
      type="text"
      label="Adresse email"
      name="email"
      placeholder="Entrez votre email"
      :required="true"
    />

    <Input
      v-model="lastNameInput"
      type="text"
      label="Nom"
      name="lastname"
      placeholder="Entrez votre nom"
      :required="true"
    />

    <Input
      v-model="firstNameInput"
      type="text"
      label="Prénom"
      name="firstname"
      placeholder="Entrez votre prénom"
      :required="true"
    />

    <Input
      v-model="passwordInput"
      type="password"
      label="Mot de passe"
      name="password"
      placeholder="Entrez votre mot de passe"
      :required="true"
    />

    <ul v-if="errorMessages.length" class="form-errors">
      <li v-for="error in errorMessages" :key="error">{{ error }}.</li>
    </ul>

    <div class="auth-actions">
      <Button icon="Arrow" iconPosition="right" :disabled="loadingState" type="submit">{{
        loadingState ? 'Création...' : 'Créer un compte'
      }}</Button>
      <div class="separator">Ou</div>
      <Button icon="Arrow" variant="neutral" iconPosition="right">Se connecter avec Google</Button>
    </div>

    <hr />

    <span>
      Vous avez déjà un compte ?
      <span class="auth-action-link" @click="$emit('login')">Connexion</span>
    </span>
  </form>
</template>

<style scoped></style>
