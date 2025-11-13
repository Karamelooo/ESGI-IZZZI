<script lang="ts" setup>
import Icon from '../base/Icon.vue';
const props = defineProps<{
  title: string;
  desc: string;
}>();
</script>

<template>
  <div class="classButtonContainer">
    <div class="iconContainer">
      <Icon name="Eyes" />
    </div>
    <div>
      <h3>{{ title }}</h3>
      <p class="p14">{{ desc }}</p>
    </div>
  </div>
</template>

<style scoped>
.classButtonContainer {
  display: flex;
  background-color: var(--gray-2);
  border: 1px solid var(--gray-15);
  border-radius: 8px;
  width: 362px;
  height: 96px;
  padding: 20px;
}

.iconContainer {
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--white);
  border-radius: 10px;
  margin-right: 21px;
}

.classButtonContainer h3 {
  margin-bottom: 1rem;
}

.classButtonContainer:hover {
  background-color: var(--primary);
  cursor: pointer;
}
.classButtonContainer:hover .iconContainer {
  background-color: var(--beige);
}
@media (min-width: 1024px) {
  .classButtonContainer {
    width: 576px;
  }
}
</style>
