<script setup lang="ts">
import { ref } from 'vue';
import Input from '../../components/base/Input.vue';
import Button from '../../components/base/Button.vue';

const emit = defineEmits<{
  (e: 'forgot-password'): void;
  (e: 'register'): void;
}>();

const emailInput = ref('');
const passwordInput = ref('');
</script>

<template>
  <form class="auth-form">
    <Input
      v-model="emailInput"
      type="text"
      label="Adresse email"
      name="email"
      placeholder="Entrez votre email"
      :required="false"
    />

    <Input
      v-model="passwordInput"
      type="password"
      label="Mot de passe"
      name="password"
      placeholder="Entrez votre mot de passe"
      :links="[{ label: 'Mot de passe oublié ?' }]"
      :required="false"
      @link-click="$emit('forgot-password')"
    />

    <div class="actions">
      <Button icon="Arrow" iconPosition="right">Se connecter</Button>
      <div class="separator">Ou</div>
      <Button icon="Arrow" variant="neutral" iconPosition="right">Se connecter avec Google</Button>
    </div>

    <span>
      Pas encore de compte ?
      <span class="register-link" @click="$emit('register')">Inscription</span>
    </span>
  </form>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.register-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
