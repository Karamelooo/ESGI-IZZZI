<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from '../composables/useToast';

const toast = useToast();

const activeTab = ref(0);
const nameInput = ref('');
const emailInput = ref('');
const passwordInput = ref('');
const textareaInput = ref('');
const disabledInput = ref('');
</script>

<template>
  <h1>UI Kit — © IZZZI 2025.</h1>

  <h3>Logos</h3>

  <div class="row">
    <Logo />
    <Logo size="small" alt="Texte alternatif" linkToHome="true" />
  </div>

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

  <h3>Champs de saisie</h3>

  <Input v-model="nameInput" label="Nom" name="nom" placeholder="Entrez votre nom" required />

  <Input
    v-model="emailInput"
    type="email"
    label="Email"
    name="email"
    placeholder="exemple@mail.com"
    :disabled="false"
    :required="true"
  />

  <Input
    v-model="passwordInput"
    type="password"
    label="Mot de passe"
    name="password"
    placeholder="Votre mot de passe"
    :rules="[{ type: 'minLength', value: 8 }, { type: 'hasDigit' }, { type: 'hasSymbol' }]"
    required
  />

  <Input
    v-model="textareaInput"
    type="textarea"
    label="Champ de texte long"
    name="textarea"
    placeholder="Écrire un texte..."
    :required="false"
  />

  <Input v-model="disabledInput" name="disabledField" placeholder="Champ désactivé" :disabled="true" />

  <h3>Onglets</h3>

  <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Onglet 1' }, { name: 'Onglet 2' }]" />
  <SwitchPanels :activeTab="activeTab">
    <template #tab-0>Voici le contenu de l'onglet 1.</template>
    <template #tab-1>Voici le contenu de l'onglet 2.</template>
  </SwitchPanels>

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
</template>

<style scoped>
.row {
  display: flex;
  gap: 20px;
}
</style>
