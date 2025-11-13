<script lang="ts" setup>
import Button from '../base/Button.vue';

const archived = true;
const archivedDate = '23 mars 2025';
const buttonText = archived ? 'Voir la classe' : '';
const buttonText2 = archived ? 'Modifier la classe' : 'Voir la classe';
const buttonIcon = archived ? 'Pen-Mobile' : 'Eyes';
const classDesc = 'Description de la classe';
const studentsCount = 24;
</script>

<template>
  <div class="classContainer">
    <div class="classTop">
      <div class="classDesc">
        <h3>B3UI</h3>
        <p class="p12">{{ classDesc }}</p>
        <p class="p10 studentsCount">{{ studentsCount }} étudiants</p>
        <p v-if="archived" class="p10 classArchived">Archivée le {{ archivedDate }}</p>
      </div>
      <div>
        <Button variant="plain" icon="Arrow" class="buttonShowClass" iconPosition="right">{{ buttonText }}</Button>
      </div>
    </div>
    <section class="buttonContainer">
      <Button variant="plain" :icon="buttonIcon" class="buttonClass" iconPosition="left">{{ buttonText2 }}</Button>
      <Button v-if="archived" variant="plain" class="buttonClass">Archiver</Button>
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
