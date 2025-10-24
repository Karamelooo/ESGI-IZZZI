<script lang="ts" setup>
import { ref } from 'vue';
import Login from '../../components/auth/Login.vue';
import Register from '../../components/auth/Register.vue';

function handleForgotPassword() {
  activePage.value = 'forgot-password';
}

function handleRegister() {
  activePage.value = 'auth';
  activeTab.value = 1;
}

const activePage = ref('auth');
const activeTab = ref(0);
</script>

<template>
  <main class="auth-main">
    <Logo :size="130" />

    <Card v-if="activePage === 'auth'" :centered="true">
      <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Se connecter' }, { name: 'S\'inscrire' }]" />
      <SwitchPanels :activeTab="activeTab">
        <template #tab-0>
          <Login @forgot-password="handleForgotPassword" @register="handleRegister" />
        </template>

        <template #tab-1>
          <Register />
        </template>
      </SwitchPanels>
    </Card>

    <Card v-if="activePage === 'forgot-password'">
      <span>Mot de passe oublié</span>
    </Card>
  </main>
</template>

<style>
.auth-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 36px;
}

.auth-main .switch-tabs {
  width: 100%;
  justify-content: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 438px;
}

.auth-form .input-wrapper {
  width: 100%;
}

.auth-form .button {
  margin: 0 auto;
}

.auth-form .separator {
  font-family: 'Mochiy Pop One';
  font-size: 1.15rem;
}
</style>
