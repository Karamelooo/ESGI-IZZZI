<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from '@composables/useToast';
import RadioGroup from '@components/form/RadioGroup.vue';
import CheckBoxGroup from '@components/form/CheckBoxGroup.vue';
import Loader from '@components/animated/Loader.vue';
import Live from '@components/animated/Live.vue';
import Banderole from '@components/animated/Banderole.vue';
import CardClass from '@components/layout/CardClass.vue';
import CardClassButton from '@components/layout/CardClassButton.vue';
import CardClassHome from '@components/layout/CardClassHome.vue';

const toast = useToast();

const activeTab = ref(0);
const nameInput = ref('');
const passwordInput = ref('');
const selectedRadio = ref('');
const selectedCheckBox = ref([]);

function onRadioChange(value: string, index: number) {}
function onCheckBoxChange(value: string[], index: number) {}

const iconFiles = import.meta.glob('/src/assets/svg/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const iconNames = Object.keys(iconFiles)
  .map((p) => p.split('/').pop()!.replace('.svg', ''))
  .sort((a, b) => a.localeCompare(b));

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

const iconRows = chunk(iconNames, 7);
</script>

<template>
  <div class="ui-kit-container">
    <h1>UI Kit — © IZZZI 2025.</h1>

    <div class="component">
      <h3>Card Classe</h3>
      <div>
        <CardClassHome
          title="Amélioration continue"
          text="N'offrez pas à vos étudiants l'occasion d'être déçus. Captez leurs retours avant la fin de du module et ajuster ce qui mérite de l'être en live."
          emphase="Ne soyez plus désolé"
        />
        <br />
        <CardClassButton title="Basique" desc="Adapté à tous les cours" />
        <br />
        <CardClass className="B3UI" :studentsCount="24" classDesc="Desccription de la classe" :archived="false" />
      </div>
    </div>
    <div class="component">
      <h3>Logos</h3>

      <div class="row">
        <Logo :linkToHome="true" />
        <Logo size="small" alt="Texte alternatif" />
      </div>
    </div>

    <div class="component">
      <h3>Boutons</h3>

      <div class="row">
        <Button icon="Arrow" iconPosition="right">Primaire</Button>
        <Button :disabled="true">Primaire — désactivé</Button>
        <Button variant="neutral">Neutre</Button>
        <Button variant="neutral" :disabled="true">Neutre — désactivé</Button>
        <Button variant="plain" icon="Arrow" iconPosition="right">Sans fond</Button>
        <Button variant="plain" :disabled="true">Sans fond — désactivé</Button>
      </div>
    </div>

    <div class="component">
      <h3>Onglets</h3>

      <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Onglet 1' }, { name: 'Onglet 2' }]" />
      <SwitchPanels :activeTab="activeTab">
        <template #tab-0>Voici le contenu de l'onglet 1.</template>
        <template #tab-1>Voici le contenu de l'onglet 2.</template>
      </SwitchPanels>
    </div>

    <div class="component">
      <h3>Formulaires</h3>

      <Input
        v-model="nameInput"
        type="text"
        label="Nom"
        name="name"
        placeholder="Votre nom complet"
        :rules="[{ type: 'minLength', value: 1 }]"
        :required="true"
      />

      <Input
        v-model="passwordInput"
        type="password"
        label="Mot de passe"
        name="password"
        placeholder="Votre mot de passe"
        :rules="[{ type: 'minLength', value: 8 }, { type: 'hasDigit' }, { type: 'hasSymbol' }]"
        :required="true"
      />

      <RadioGroup
        v-model="selectedRadio"
        :options="[
          { label: 'Option 1' },
          { label: 'Option 2', color: 'var(--error)' },
          { label: 'Option 3', color: 'var(--error)', icon: 'Check-Desktop', value: 'custom-value' },
        ]"
        label-position="right"
        @change="onRadioChange"
      />
      <div class="info">Valeur sélectionnée : {{ selectedRadio || 'Aucune' }}</div>

      <CheckBoxGroup
        v-model="selectedCheckBox"
        :options="[
          { label: 'Option 1' },
          { label: 'Option 2' },
          { label: 'Option 3', color: 'var(--error)', value: 'custom-value' },
        ]"
        label-position="right"
        @change="onCheckBoxChange"
      />
      <div class="info">
        Valeurs sélectionnées : {{ selectedCheckBox.length > 0 ? selectedCheckBox.join(', ') : 'Aucune' }}
      </div>
    </div>

    <div class="component">
      <h3>Icônes</h3>

      <div class="row" style="flex-wrap: wrap">
        <table style="border-collapse: collapse">
          <tr v-for="(row, rIdx) in iconRows" :key="rIdx" class="icon-item">
            <td v-for="name in row" :key="name" style="border: 1px solid black">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px">
                <span style="font-size: 14px">{{ name }}</span>
                <Icon :name="name" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="component">
      <h3>Animations</h3>
      <div class="row">
        <Loader />
        <Live />
      </div>
      <div class="row">
        <Banderole />
      </div>
    </div>

    <div class="component">
      <h3>Toasts</h3>

      <div class="row">
        <Button @click="toast.success('Lorem ipsum.')">Success</Button>
        <Button @click="toast.positive('Lorem', 'Lorem ipsum.')">Positive</Button>
        <Button @click="toast.negative('Lorem', 'Lorem ipsum.')">Negative</Button>
        <Button @click="toast.info('Lorem ipsum.')">Info</Button>
        <Button @click="toast.warning('Lorem', undefined, undefined, 'Lorem ipsum.')">Warning</Button>
        <Button @click="toast.infoWarning('Lorem ipsum.')">InfoWarning</Button>
        <Button @click="toast.lock('Lorem ipsum.')">Lock</Button>
        <Button @click="toast.lockWarning('Lorem ipsum.')">LockWarning</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-kit-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 20px;
}

.component {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-15);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info {
  font-size: 14px;
  font-style: italic;
}
</style>
