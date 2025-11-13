<script lang="ts" setup>
import Button from '../base/Button.vue';

const permission = true;
const archived = true;
const buttonText = permission ? 'Voir la classe' : '';
const buttonText2 = permission ? 'Modifier la classe' : 'Voir la classe';
const buttonIcon = permission ? 'Pen-Mobile' : 'Eyes';
</script>

<template>
  <div class="classContainer">
    <div class="classTop">
      <div class="classDesc">
        <h3>B3UI</h3>
        <p class="p12">Description de la classe</p>
        <p class="p10 studentsCount">24 étudiants</p>
        <p v-if="archived" class="p10 classArchived">Archivée le 23 mars 2025</p>
      </div>
      <div>
        <Button variant="plain" icon="Arrow" class="buttonShowClass" iconPosition="right">{{ buttonText }}</Button>
      </div>
    </div>
    <section class="buttonContainer">
      <Button variant="plain" :icon="buttonIcon" class="buttonClass" iconPosition="left">{{ buttonText2 }}</Button>
      <Button v-if="permission" variant="plain" class="buttonClass">Archiver</Button>
    </section>
  </div>
</template>

<style scoped>
.classContainer {
  display: flex;
  flex-direction: column;
  width: 362px;
}

.classDesc p {
  line-height: 2;
}

.classArchived {
  font-style: italic;
}

.classTop {
  margin-bottom: 3rem;
}

.buttonClass {
  text-decoration: underline;
}

.studentsCount {
  font-weight: bold;
}

.buttonContainer,
.classTop {
  display: flex;
  justify-content: space-between;
}

@media (min-width: 1024px) {
  .classContainer {
    width: 531px;
  }
}
</style>
