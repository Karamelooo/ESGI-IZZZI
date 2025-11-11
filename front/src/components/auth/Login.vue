<script lang="ts" setup>
import { ref } from 'vue';
import Input from '@components/base/Input.vue';
import Button from '@components/base/Button.vue';
import { login } from '@api/auth.ts';

const emit = defineEmits<{
  (e: 'forgot-password'): void;
  (e: 'register'): void;
}>();

const emailInput = ref('');
const passwordInput = ref('');

const loadingState = ref(false);
const errorMessages = ref<string[]>([]);

async function onSubmit(event: Event) {
  event.preventDefault();
  loadingState.value = true;
  errorMessages.value = [];

  try {
    const data: any = await login({
      email: emailInput.value,
      password: passwordInput.value,
    });
    loadingState.value = false;
    console.log(data);
  } catch (error: any) {
    loadingState.value = false;
    if (error?.response?.data?.message) {
      errorMessages.value = Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message];
    } else {
      errorMessages.value = ['Une erreur est survenue'];
    }
  }
}
</script>

<template>
  <form class="auth-form auth-form--centered" @submit="onSubmit">
    <Input
      v-model="emailInput"
      type="text"
      label="Adresse email"
      name="email"
      placeholder="Entrez votre email"
      :required="true"
    />

    <Input
      v-model="passwordInput"
      type="password"
      label="Mot de passe"
      name="password"
      placeholder="Entrez votre mot de passe"
      :links="[{ label: 'Mot de passe oublié ?' }]"
      :required="true"
      @link-click="$emit('forgot-password')"
    />

    <ul v-if="errorMessages.length" class="form-errors">
      <li v-for="error in errorMessages" :key="error">{{ error }}.</li>
    </ul>

    <div class="auth-actions">
      <Button icon="Arrow" iconPosition="right" :disabled="loadingState" type="submit">{{
        loadingState ? 'Connexion...' : 'Se connecter'
      }}</Button>
      <div class="separator">Ou</div>
      <Button icon="Arrow" variant="neutral" iconPosition="right">Se connecter avec Google</Button>
    </div>

    <hr />

    <span>
      Pas encore de compte ?
      <span class="auth-action-link" @click="$emit('register')">Inscription</span>
    </span>
  </form>
</template>

<style scoped></style>
