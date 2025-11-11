<script lang="ts" setup>
import { ref } from 'vue';
import Input from '@components/base/Input.vue';
import Button from '@components/base/Button.vue';
import { register } from '@api/auth.ts';

const emit = defineEmits<{
  (e: 'login'): void;
}>();

const emailInput = ref('');
const passwordInput = ref('');
const firstNameInput = ref('');
const lastNameInput = ref('');

const loadingState = ref(false);
const errorMessage = ref('');

async function onSubmit(event: Event) {
  event.preventDefault();
  loadingState.value = true;
  errorMessage.value = '';
  try {
    const data: any = await register({
      email: emailInput.value,
      password: passwordInput.value,
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
    });
    loadingState.value = false;
    console.log(data);
  } catch (error: any) {
    errorMessage.value = error;
    loadingState.value = false;
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
      placeholder="Votre mot de passe"
      :required="true"
    />

    <div v-if="errorMessage" class="form-error">{{ errorMessage }}</div>

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
