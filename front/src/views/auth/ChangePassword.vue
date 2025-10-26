<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const newPasswordInput = ref('');
const confirmPasswordInput = ref('');

function handleSubmit() {
  router.push('/auth');
}
</script>

<template>
  <main class="auth-main">
    <Logo :size="130" />

    <Card>
      <form class="auth-form">
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

        <Button icon="Arrow" iconPosition="right" @click="handleSubmit">Réinitialiser</Button>
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
