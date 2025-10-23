<script setup lang="ts">
import Input from '../../components/base/Input.vue';
import Button from '../../components/base/Button.vue';
import { ref } from 'vue';
const emailInput = ref('');
const passwordInput = ref('');

</script>

<template>
<form>
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
      placeholder="Votre mot de passe"
      :required="false"
    />
    </form>
    <a href="#">Mot de passe oublié ?</a>
    <br></br>
    <Button icon="Arrow" iconPosition="right">Se connecter</Button>
    <div class="login-separator">Ou</div>
    <!-- TODO: implémenter bouton widget Google -->
    <Button icon="Arrow" variant="neutral" iconPosition="right">Se connecter avec Google</Button>
    <p class="no-account">Pas encore de compte ? <a href="#">Inscription</a></p>
</template>

<style>

</style>
