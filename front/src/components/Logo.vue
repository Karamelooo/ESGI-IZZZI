<script lang="ts" setup>
import { computed } from 'vue';
import logoSrc from '../assets/svg/Logo.svg';

const LOGO_SIZES = {
  regular: 112,
  small: 86,
} as const;

type LogoSize = keyof typeof LOGO_SIZES;

const props = withDefaults(
  defineProps<{
    size?: LogoSize;
    alt?: string;
    linkToHome?: boolean;
  }>(),
  {
    size: 'regular',
    alt: 'Logo',
    linkToHome: false,
  }
);

const computedWidth = computed(() => LOGO_SIZES[props.size]);
</script>

<template>
  <router-link v-if="linkToHome" to="/" class="link-center">
    <img :src="logoSrc" :alt="alt" :width="computedWidth" class="logo" />
  </router-link>

  <img v-else :src="logoSrc" :alt="alt" :width="computedWidth" class="logo" />
</template>

<style scoped>
.logo {
  display: block;
  height: auto;
}

.link-center {
  display: flex;
  align-items: center;
}
</style>
