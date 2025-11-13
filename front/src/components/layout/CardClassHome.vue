<script lang="ts" setup>
const props = defineProps<{
  title: string;
  text: string;
  emphase?: string;
}>();
</script>

<template>
  <div class="classHome">
    <p class="classHomeEmphase">{{ emphase }}</p>
    <div>
      <h4>{{ title }}</h4>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
.classHome {
  display: flex;
  align-items: end;
  flex-direction: column;
  justify-content: space-between;
  width: 342px;
  height: 452px;
  border-radius: 8px;
  background-color: var(--yellow);
  padding: 40px;
}

.classHome h4 {
  margin-bottom: 1rem;
}

.classHomeEmphase {
  width: 112px;
  text-align: center;
  font-family: 'Pecita';
  font-size: 22px;
  transform: rotate(15deg);
}

@media (min-width: 1024px) {
  .classHome {
    width: 443px;
  }
  .classHome h4 {
    font-size: 2rem;
  }
}
</style>
