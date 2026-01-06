<script lang="ts" setup>


defineProps<{
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
      <p v-html="text"></p>
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
  border-radius: 20px;
  background-color: var(--yellow);
  padding: 40px;
}

.classHome h4 {
  margin-bottom: 1rem;
}

.classHomeEmphase {
  width: 112px;
  text-align: center;
  font-family: 'Pecita', sans-serif;
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
