<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Login from '@components/auth/Login.vue';
import Register from '@components/auth/Register.vue';
import { useAuthStore } from '@stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function goToForgotPassword() {
  router.push('/auth/forgot-password');
}

function goToLogin() {
  activeTab.value = 0;
}

function goToRegister() {
  activeTab.value = 1;
}

const activeTab = ref(0);
</script>

<template>
  <main class="auth-main">
    <Logo :size="130" :linkToHome="true" />

    <Card :centered="true">
      <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Se connecter' }, { name: 'S\'inscrire' }]" />
      <SwitchPanels :activeTab="activeTab" v-bind="activeTab === 1 ? { maxHeight: '47vh' } : {}" class="switch-panels">
        <template #tab-0>
          <Login @forgot-password="goToForgotPassword" @register="goToRegister" />
        </template>

        <template #tab-1>
          <Register @login="goToLogin" />
        </template>
      </SwitchPanels>
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

  .form {
    width: 100%;
  }
}
</style>
