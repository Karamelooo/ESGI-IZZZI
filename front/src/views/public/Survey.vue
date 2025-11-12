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
    <section id="survey-info">
      <Logo />
      <h2>{{ Matiere }}</h2>
      <div id="survey-cadre">
        <div>
          <Icon name="School" /><strong>{{ Formation }}</strong>
        </div>
        <hr />
        <div>
          <Icon name="People" /><strong>{{ Classe }}</strong>
        </div>
      </div>
      <p>
        Soit sincère, sinon ça ne sert à rien.
        <br />
        <br />
        C’est grâce à vous retours que nous pouvons améliorer les interventions et coller le plus possible à vos
        attentes.
      </p>
    </section>
    <section id="survey">
      <Card id="survey-class" class="survey-card">
        <h2>Le cours</h2>
        <p>Juste quelques questions sur le cours</p>
        <Survey :questions="ListQuestionsCours" />
      </Card>
      <Card id="survey-inter" class="survey-card">
        <h2>Votre intervenant</h2>
        <p>Maintenant, quelques questions sur l’intervenant et après on a fini.</p>
        <Survey :questions="ListQuestionsIntervenant" />
      </Card>
      <Button icon="Arrow" iconPosition="right" id="survey-send">Envoyer</Button>
      <p id="survey-paragraphe">Ce formulaire est diffusé par <b>IZZZI</b></p>
    </section>
  </main>
</template>

<style scoped>
main {
  background-color: var(--gray-5);
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 6.25rem;
}

#survey-info {
  width: 415px;
}

#survey-info .logo {
  margin-bottom: 5rem;
}

#survey {
  width: 652px;
}

.survey-card {
  margin-bottom: 1.75rem;
  padding: 5rem;
}

#survey-send {
  margin-bottom: 1.75rem;
}

strong,
#survey-paragraphe {
  font-size: 0.75rem;
}

#survey-cadre {
  border: 1px solid var(--gray-15);
  width: auto;
  display: inline-flex;
  gap: 0.75rem;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  margin: 1.875rem 0;
}

#survey-cadre div {
  display: flex;
  align-items: center;
  gap: 10px;
}

#survey-cadre hr {
  display: inline-block;
  width: 1rem;
  transform: rotate(90deg);
  position: relative;
  left: -0.75rem;
}
</style>
