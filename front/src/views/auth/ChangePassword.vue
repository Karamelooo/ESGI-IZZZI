<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApi } from '@/api/axios';
import { useToast } from '@composables/useToast';

const router = useRouter();
const route = useRoute();
const api = useApi();
const toast = useToast();

const newPasswordInput = ref('');
const confirmPasswordInput = ref('');
const loading = ref(false);
const token = ref('');

onMounted(() => {
  token.value = route.query.token as string;
  if (!token.value) {
    toast.negative('Erreur', 'Lien de réinitialisation invalide.');
    router.push('/auth');
  }
});

async function handleSubmit() {
  if (loading.value) return;
  if (!newPasswordInput.value || !confirmPasswordInput.value) {
    toast.negative('Erreur', 'Veuillez remplir tous les champs.');
    return;
  }
  if (newPasswordInput.value !== confirmPasswordInput.value) {
    toast.negative('Erreur', 'Les mots de passe ne correspondent pas.');
    return;
  }

  loading.value = true;
  try {
    await api.post('/auth/reset-password', {
      token: token.value,
      password: newPasswordInput.value,
    });
    toast.success('Succès', 'Votre mot de passe a été réinitialisé.');
    router.push('/auth');
  } catch (e) {
    console.error(e);
    toast.negative('Erreur', 'Une erreur est survenue lors de la réinitialisation.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-main">
    <Logo :size="130" />

    <Card>
      <form class="form">
        <span class="title">Définir un nouveau mot de passe</span>

        <Input
          v-model="newPasswordInput"
          type="password"
          label="Nouveau mot de passe"
          name="new-password"
          placeholder="Entrez votre mot de passe"
          :rules="[{ type: 'minLength', value: 8 }, { type: 'hasDigit' }, { type: 'hasSymbol' }]"
          :required="true"
        />

        <Input
          v-model="confirmPasswordInput"
          type="password"
          label="Confirmer le mot de passe"
          name="confirm-password"
          placeholder="Confirmez votre mot de passe"
          :rules="[{ type: 'matchValue', value: newPasswordInput, message: 'Les mots de passe ne correspondent pas.' }]"
          :required="true"
        />

        <Button icon="Arrow" iconPosition="right" :disabled="loading" @click="handleSubmit">
          {{ loading ? 'Réinitialisation...' : 'Réinitialiser' }}
        </Button>
      </form>
    </Card>
  </main>
</template>

<style scoped>
.title {
  font-family: 'Mochiy Pop One';
  font-size: 18px;
}
</style>
