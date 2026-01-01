<script lang="ts" setup>
import SwitchPanels from '@/components/layout/SwitchPanels.vue';
import SwitchTabs from '@/components/layout/SwitchTabs.vue';
import { ref } from 'vue';
import Card from '@/components/layout/Card.vue';
import Button from '@/components/base/Button.vue';
import Icon from '@/components/base/Icon.vue';

const activeTab = ref(0);
const activeTab2 = ref(0);
</script>

<template>
  <main>
    <h3>Deux plans. Zéro friction.</h3>
    <br />
    <p>Commencez gratuitement et passez au niveau supérieur quand vous êtes prêts.</p>
    <br />
    <SwitchTabs v-model="activeTab" :tabs="[{ name: 'Annuel -30%' }, { name: 'Mensuel' }]" />
    <SwitchPanels :activeTab="activeTab">
      <template #tab-0>
        <Card class="annuel-tarif">
          <Button variant="neutral" round>👌🏻 Izzzi</Button>
          <h1>0€<span>/ mois</span></h1>
          <Button icon="Arrow" iconPosition="right">Démarrer mes 4 mois gratuits</Button>
          <div>
            <ul>
              <li>4 mois d’essai illimités <span>(matières, classes, retours)</span></li>
              <li>Puis 5 retours visibles par matière<span>(les autres sont enregistrés mais masqués)</span></li>
              <li>Anonymat garanti pour tous les retours</li>
              <li>Relance manuelle possible <span>(bouton à cliquer)</span></li>
              <li>Export des retours en CSV à tout moment</li>
              <li>QR code généré automatiquement</li>
              <li>IA avancée <span>(alertes négatives & alertes positives)</span></li>
              <li>Page de suivi des alertes<span>(notifications, commentaires possibles)</span></li>
            </ul>
            <p class="p12">Au-delà des 4 mois :</p>
            <ul>
              <li>Vos classes restent actives</li>
              <li>Les retours visibles sont limités à 5 par matière</li>
            </ul>
          </div>
          <Button icon="Arrow" iconPosition="right" variant="neutral">Voir les détails du plan</Button>
        </Card>
        <h2>Comparez nos plans</h2>
      </template>
      <template #tab-1>Voici le contenu de l'onglet 2.</template>
    </SwitchPanels>
    <SwitchTabs v-model="activeTab2" round :tabs="[{ name: '👌🏻 Izzzi' }, { name: '🙌 Super Izzzi' }]" />
    <SwitchPanels :activeTab="activeTab2">
      <template #tab-0>
        <Card class="plans">
          <Button variant="neutral" round>👌🏻 Izzzi</Button>
          <div>
            <h3>0€ <span>par mois</span></h3>
            <p class="p10">(4 mois d'essai illimités)</p>
          </div>
          <Button icon="Arrow" iconPosition="right">Démarrer l'essai gratuit</Button>
          <Icon name="Info-Desktop" />
        </Card>
      </template>
      <template #tab-1>Voici le contenu de l'onglet 2.</template>
    </SwitchPanels>
  </main>
</template>

<style scoped>
main {
  margin: 10rem 1rem 0 1rem;
}

.annuel-tarif {
  padding: 3rem;
  margin-bottom: 5rem;
}

.annuel-tarif h1 span {
  font-size: 12px;
}

.annuel-tarif ul {
  list-style: url('src/assets/svg/icons/Check-Desktop.svg');
}

.annuel-tarif ul li {
  padding: 0.2rem 1rem;
  line-height: 1.5rem;
}

.annuel-tarif ul li span {
  display: block;
  font-size: 12px;
}

.annuel-tarif .p12 {
  margin-top: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.plans {
  text-align: center;
}

.plans h3 span {
  font-size: 12px;
  font-family: 'Poppins';
  font-weight: normal;
}
</style>
