<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useApi } from '@/api/axios';
import AuthLayout from '@components/layout/AuthLayout.vue';
import Input from '@components/base/Input.vue';
import Button from '@components/base/Button.vue';
import { useToast } from '@composables/useToast';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const api = useApi();
const toast = useToast();

const token = route.query.token as string;
const invitation = ref<any>(null);
const loading = ref(true);
const error = ref('');

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

onMounted(async () => {
  if (!token) {
    error.value = 'Token manquant';
    loading.value = false;
    return;
  }

  try {
    const { data } = await api.get(`/invitations/token/${token}`);
    invitation.value = data;
    email.value = data.email || '';
  } catch (e) {
    error.value = 'Invitation invalide ou expirée';
  } finally {
    loading.value = false;
  }
});

const submit = async () => {
    if (password.value !== confirmPassword.value) {
        toast.negative('Erreur', 'Les mots de passe ne correspondent pas');
        return;
    }

    try {
        await api.post(`/invitations/token/${token}/accept`, {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        });
        
        await authStore.login({ email: email.value, password: password.value });
        toast.success('Compte créé', 'Bienvenue sur la plateforme !');
        router.push('/dashboard');
        
    } catch (e) {
        console.error(e);
        toast.negative('Erreur', 'Une erreur est survenue lors de l\'inscription');
    }
}
</script>

<template>
  <AuthLayout title="Rejoindre l'équipe" :subtitle="invitation ? `Invitation pour ${invitation.institution.name}` : ''" class="auth">
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="form">
      <div class="row">
        <Input v-model="firstName" label="Prénom" placeholder="John" required />
        <Input v-model="lastName" label="Nom" placeholder="Doe" required />
      </div>

      <Input v-model="email" type="email" label="Email" placeholder="john@doe.com" required :disabled="!!invitation.email" />
      <Input v-model="password" type="password" label="Mot de passe" placeholder="••••••••" required />
      <Input v-model="confirmPassword" type="password" label="Confirmer le mot de passe" placeholder="••••••••" required />

      <Button width="fill" @click="submit">Créer mon compte</Button>
      
      <p class="login-link">
        Déjà un compte ? <router-link to="/auth">Se connecter</router-link>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth {
  margin-top: 5vh;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form input {
  width: 15vw;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.error {
    color: var(--error);
    text-align: center;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: var(--gray-60);
}

.login-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
