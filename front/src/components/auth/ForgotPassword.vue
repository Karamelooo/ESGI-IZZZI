<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'login'): void;
}>();

const isFormSubmitted = ref(false);
const emailInput = ref('');

function handleSubmit() {
  if (isFormSubmitted.value) return;
  isFormSubmitted.value = true;
}
</script>

<template>
  <form v-if="!isFormSubmitted" class="auth-form">
    <span class="title">Mot de passe oublié</span>

    <Input
      v-model="emailInput"
      type="text"
      label="Adresse email"
      name="email"
      placeholder="Entrez votre email"
      :required="false"
    />

    <Button icon="Arrow" iconPosition="right" @click="handleSubmit">Réinitialiser</Button>
  </form>

  <form v-else class="auth-form">
    <span class="title">📩 Email de réinitialisation envoyé !</span>

    <p class="description">
      Vérifiez votre boîte de réception (et votre dossier spam au cas où) ! Nous vous avons envoyé un email avec un lien
      pour réinitialiser votre mot de passe.
    </p>

    <p class="description">Si vous ne recevez rien, essayez à nouveau ou contactez notre support. 😊</p>

    <Button icon="Arrow" iconPosition="right" @click="$emit('login')">Retour à la connexion</Button>
  </form>
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
