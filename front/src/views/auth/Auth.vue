<script lang="ts" setup>
import { ref } from 'vue';
import ForgotPassword from '@components/auth/ForgotPassword.vue';
import Login from '@components/auth/Login.vue';
import Register from '@components/auth/Register.vue';

function goToForgotPassword() {
  activePage.value = 'forgot-password';
}

function goToLogin() {
  activePage.value = 'auth';
  activeTab.value = 0;
}

function goToRegister() {
  activePage.value = 'auth';
  activeTab.value = 1;
}

const activePage = ref('auth');
const activeTab = ref(0);
</script>

<template>
  <main class="auth-main">
    <Logo :size="130" />

    <Card v-if="activePage === 'auth'" :centered="true" :fullWidth="true">
      <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Se connecter' }, { name: 'S\'inscrire' }]" />
      <SwitchPanels :activeTab="activeTab" class="switch-panels">
        <template #tab-0>
          <Login @forgot-password="goToForgotPassword" @register="goToRegister" />
        </template>

        <template #tab-1>
          <Register @login="goToLogin" />
        </template>
      </SwitchPanels>
    </Card>

    <Card v-if="activePage === 'forgot-password'">
      <ForgotPassword @login="goToLogin" />
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
  gap: 24px;
  width: 438px;
}

.auth-form--centered {
  align-items: center;
}

.auth-form .input-wrapper {
  width: 100%;
}

.auth-form .button {
  margin: 0;
}

.auth-form--centered .button {
  margin: 0 auto;
}

.auth-form .separator {
  font-family: 'Mochiy Pop One';
  font-size: 1.15rem;
}

.auth-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.auth-action-link {
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 600px) {
  .auth-main {
    margin: 36px 16px;
    justify-content: flex-start;
  }

  .auth-main .card {
    width: 100%;
  }

  .auth-main .switch-panels {
    width: 100%;
  }

  .auth-form {
    width: 100%;
  }
}
</style>
