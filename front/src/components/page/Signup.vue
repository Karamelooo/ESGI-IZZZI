<script setup lang="ts">
import Input from '../../components/base/Input.vue';
import Button from '../../components/base/Button.vue';
import { ref } from 'vue';
const emailInput = ref('');
const passwordInput = ref('');
const lastnameInput = ref('');
const firstnameInput = ref('');

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
      v-model="lastnameInput"
      type="text"
      label="Nom"
      name="lastname"
      placeholder="Entrez votre nom"
      :required="false"
    />
    <Input
      v-model="firstnameInput"
      type="text"
      label="Nom"
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
    </form>
    <a href="#">Mot de passe oublié ?</a>
    <br></br>
    <Button size="small" icon="Arrow" iconPosition="right">Créer un compte</Button>
    <div class="login-separator">Ou</div>
    <!-- TODO: implémenter bouton widget Google -->
    <Button size="small" icon="Arrow" variant="neutral" iconPosition="right">Se connecter avec Google</Button>
    <p class="no-account">Vous avez déjà un compte ? <a href="#">Inscription</a></p>
</template>

<style>
</style>
