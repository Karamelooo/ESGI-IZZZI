<script lang="ts" setup>
import Logo from '../../components/base/Logo.vue';
import Card from '../../components/layout/Card.vue';
import Survey from '../../components/form/Survey.vue';
import type { Question } from '../../types/survey';
import { ref } from 'vue';

function formatOptions(options: string[]) {
  return options.map((option, index) => ({
    value: option,
    label: option,
  }));
}

function generateScaleOptions(min: number, max: number) {
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push({
      value: i.toString(),
      label: i.toString(),
    });
  }
  return options;
}

const ListQuestionsCours: Question[] = [
  {
    id: 1,
    type: 'scale',
    label: 'Globalement, vous avez trouvé ce cours...',
    min: 1,
    max: 5,
  },
  {
    id: 2,
    type: 'scale',
    label: 'Le ratio théorie/pratique',
    min: 1,
    max: 5,
  },
  {
    id: 3,
    type: 'choice',
    label: 'La pertinence des infos par rapport à ce que vous imaginiez de ce cours',
    options: ['Juste comme il faut', 'Pas suffisant'],
    multiple: true,
  },
];

const ListQuestionsIntervenant: Question[] = [
  {
    id: 1,
    type: 'scale',
    label: 'Globalement, vous avez trouvé ce cours...',
    min: 1,
    max: 5,
  },
  {
    id: 2,
    type: 'scale',
    label: 'Le ratio théorie/pratique',
    min: 1,
    max: 5,
  },
  {
    id: 3,
    type: 'choice',
    label: 'La pertinence des infos par rapport à ce que vous imaginiez de ce cours',
    options: ['Juste comme il faut', 'Pas suffisant'],
    multiple: true,
  },
  {
    id: 4,
    type: 'text',
    label: 'La pertinence des infos par rapport à ce que vous imaginiez de ce cours',
  },
];

const responses = ref<Record<number, string | string[]>>({});
const Matiere = 'Webdesign et UI';
const Classe = 'M2 com digit';
const Formation = 'Narratiiv (IICP)';
</script>

<template>
  <main>
    <Logo />
    <h1>{{ Matiere }}</h1>
    <div>{{ Formation }}</div>
    <div>{{ Classe }}</div>
    <p>
      Soit sincère, sinon ça ne sert à rien.
      <br />
      <br />
      C’est grâce à vous retours que nous pouvons améliorer les interventions et coller le plus possible à vos attentes.
    </p>
    <Card> <Survey :questions="ListQuestionsCours" /> </Card>
    <Card> <Survey :questions="ListQuestionsIntervenant" /> </Card>
  </main>
</template>

<style scoped>
main {
  background-color: var(--gray-15);
}
</style>
