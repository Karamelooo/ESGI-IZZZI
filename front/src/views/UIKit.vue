<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useToast } from '../composables/useToast';

const toast = useToast();

const activeTab = ref(0);
const nameInput = ref('');
const passwordInput = ref('');

const filesIcons = import.meta.glob('/src/assets/svg/icons/*.svg', { eager: true, as: 'url' }) as Record<
  string,
  string
>;

const iconNames = computed(() => {
  return Object.keys(filesIcons)
    .map((p) => p.split('/').pop()!.replace('.svg', ''))
    .sort((a, b) => a.localeCompare(b));
});

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

const iconRows = computed(() => chunk(iconNames.value, 7));
</script>

<template>
  <div class="ui-kit-container">
    <h1>UI Kit — © IZZZI 2025.</h1>

    <div class="component">
      <h3>Logos</h3>

      <div class="row">
        <Logo />
        <Logo size="small" alt="Texte alternatif" linkToHome="true" />
      </div>
    </div>

    <div class="component">
      <h3>Boutons</h3>

      <div class="row">
        <Button>Primaire</Button>
        <Button :disabled="true">Primaire — désactivé</Button>
        <Button variant="neutral">Neutre</Button>
        <Button variant="neutral" :disabled="true">Neutre — désactivé</Button>
        <Button variant="plain">Sans fond</Button>
        <Button variant="plain" :disabled="true">Sans fond — désactivé</Button>
      </div>

      <div class="row">
        <Button size="small">Primaire</Button>
        <Button size="small" :disabled="true">Primaire — désactivé</Button>
        <Button size="small" variant="neutral">Neutre</Button>
        <Button size="small" variant="neutral" :disabled="true">Neutre — désactivé</Button>
        <Button size="small" variant="plain">Sans fond</Button>
        <Button size="small" variant="plain" :disabled="true">Sans fond — désactivé</Button>
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

      <Input v-model="nameInput" label="Nom" name="nom" placeholder="Entrez votre nom" :required="true" />

      <Input
        v-model="passwordInput"
        type="password"
        label="Mot de passe"
        name="password"
        placeholder="Votre mot de passe"
        :rules="[{ type: 'minLength', value: 8 }, { type: 'hasDigit' }, { type: 'hasSymbol' }]"
        :required="true"
      />
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
  gap: 20px;
}
</style>
