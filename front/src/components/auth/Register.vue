<script setup lang="ts">
import { ref } from 'vue';
import Input from '../../components/base/Input.vue';
import Button from '../../components/base/Button.vue';

const emit = defineEmits<{
  (e: 'login'): void;
}>();

const emailInput = ref('');
const passwordInput = ref('');
const lastNameInput = ref('');
const firstNameInput = ref('');
</script>

<template>
  <form class="auth-form auth-form--centered">
    <Input
      v-model="emailInput"
      type="text"
      label="Adresse email"
      name="email"
      placeholder="Entrez votre email"
      :required="false"
    />

    <Input
      v-model="lastNameInput"
      type="text"
      label="Nom"
      name="lastname"
      placeholder="Entrez votre nom"
      :required="false"
    />
    <Input
      v-model="firstNameInput"
      type="text"
      label="Prénom"
      name="firstname"
      placeholder="Entrez votre prénom"
      :required="false"
    />
    <Input
      v-model="passwordInput"
      type="password"
      label="Mot de passe"
      name="password"
      placeholder="Votre mot de passe"
      :required="false"
    />

    <div class="auth-actions">
      <Button icon="Arrow" iconPosition="right">Créer un compte</Button>
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
