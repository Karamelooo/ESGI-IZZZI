<script lang="ts" setup>
import Logo from '../../components/base/Logo.vue';
import { ref } from 'vue';
import Container from '../../components/base/Container.vue';
import SwitchPanels from '../../components/layout/SwitchPanels.vue';
import Signin from '../../components/page/Signin.vue';
import Signup from '../../components/page/Signup.vue';

const activeTab = ref(0);
</script>

<template>
  <main>
    <Logo />
    <Container class="login-container">
      <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Se connecter' }, { name: 'S\'inscire' }]" />
      <SwitchPanels :activeTab="activeTab">
        <template #tab-0>
          <Signin />
        </template>
        <template #tab-1>
          <Signup />
        </template>
      </SwitchPanels>
    </Container>
  </main>
</template>

<style>
.logo {
  margin: 5rem auto 2rem auto;
}

.login-container .switch-tabs {
  width: auto;
}

.login-container .switch-content {
  display: flex;
  flex-direction: column;
}

.login-container .switch-content a {
  margin-top: -0.5rem;
  text-align: right;
}

.login-container form .input-container {
  margin-bottom: 1rem;
}

.login-container button {
  margin: auto;
}

.login-container .login-separator {
  margin: 1rem auto;
  font-family: 'Mochiy Pop One';
  font-size: 1.15rem;
}

.login-container .no-account {
  margin: 2rem auto;
}

@media (min-width: 768px) {
  .container {
    margin: auto;
    width: 50vw;
  }
}
</style>
