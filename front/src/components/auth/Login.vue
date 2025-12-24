<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import FormErrors from '@components/FormErrors.vue';

const emit = defineEmits<{
  (e: 'forgot-password'): void;
  (e: 'register'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const emailInput = ref('');
const passwordInput = ref('');

const loadingState = ref(false);
const errorMessages = ref<string[]>([]);

function fillCredentials(role: 'admin' | 'manager') {
  if (role === 'admin') {
    emailInput.value = 'admin@esgi.fr';
    passwordInput.value = 'Test1234!';
  } else if (role === 'manager') {
    emailInput.value = 'manager@esgi.fr';
    passwordInput.value = 'Test1234!';
  }
}

async function onSubmit(event: Event) {
  event.preventDefault();
  if (loadingState.value) return;
  loadingState.value = true;
  errorMessages.value = [];
  try {
    await authStore.login({ email: emailInput.value, password: passwordInput.value });
    router.push('/classes');
  } catch {
    errorMessages.value = ['Identifiants invalides'];
  } finally {
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
      v-model="passwordInput"
      type="password"
      label="Mot de passe"
      name="password"
      placeholder="Entrez votre mot de passe"
      :links="[{ label: 'Mot de passe oublié ?' }]"
      :required="true"
      @link-click="$emit('forgot-password')"
    />

    <FormErrors :messages="errorMessages" />

    <div class="auth-actions">
      <Button icon="Arrow" iconPosition="right" :disabled="loadingState" type="submit">{{
        loadingState ? 'Connexion...' : 'Se connecter'
      }}</Button>
      <!--
      <div class="separator">Ou</div>
      <Button icon="Arrow" variant="neutral" iconPosition="right">Se connecter avec Google</Button>
      -->
      <div class="separator">Connexion rapide</div>
      <div style="display: flex; gap: 8px">
        <Button variant="neutral" @click="fillCredentials('admin')">Admin</Button>
        <Button variant="neutral" @click="fillCredentials('manager')">Responsable</Button>
      </div>
    </div>

    <hr />

    <span>
      Pas encore de compte ?
      <span class="auth-action-link" @click="$emit('register')">Inscription</span>
    </span>
  </form>
</template>

<style scoped></style>
