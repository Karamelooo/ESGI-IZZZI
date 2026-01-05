<script lang="ts" setup>
import SwitchPanels from '@/components/layout/SwitchPanels.vue';
import SwitchTabs from '@/components/layout/SwitchTabs.vue';
import { ref, computed } from 'vue';
import Card from '@/components/layout/Card.vue';
import Button from '@/components/base/Button.vue';
import Icon from '@/components/base/Icon.vue';
import CardTable from '@/components/layout/CardTable.vue';
import Footer from '@/components/page/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeTab2 = ref(0);
const billingPeriod = ref<'annual' | 'monthly'>('annual');
const numberOfClasses = ref(1);

const sliderSteps = [1, 5, 10, 15, 20];
const minClasses = 1;
const maxClasses = 21;
const basePriceMonthly = 22 / 7;
const basePriceAnnual = 17 / 7;

const getSliderPosition = (value: number) => {
  const clampedValue = Math.min(value, maxClasses);
  return ((clampedValue - minClasses) / (maxClasses - minClasses)) * 100;
};

const handleSliderChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  numberOfClasses.value = parseInt(target.value);
};

const handleSliderClick = (step: number) => {
  numberOfClasses.value = step;
};

const isMarkActive = (step: number) => {
  return numberOfClasses.value >= step;
};

const totalPrice = computed(() => {
  if (numberOfClasses.value > 20) {
    return null;
  }
  if (billingPeriod.value === 'annual') {
    return Math.round(basePriceAnnual * numberOfClasses.value);
  }
  return Math.round(basePriceMonthly * numberOfClasses.value);
});

const buttonText = computed(() => {
  return numberOfClasses.value > 20 ? 'Demander une offre sur mesure' : 'Je choisis ce plan';
});

const bubbleText = computed(() => {
  if (numberOfClasses.value > 20) {
    return '+20 classes';
  }
  return `${numberOfClasses.value} ${numberOfClasses.value === 1 ? 'classe' : 'classes'}`;
});

const tableData = [
  { title: 'Nombre de classes actives', content: 'Illimité' },
  { title: 'Matières par classe', content: 'Illimité' },
  { title: 'Retours visibles par matière', content: '5 par matière (après 4 mois)' },
  { title: 'Retours au-delà', content: 'Enregistrés, masqués' },
  { title: 'Anonymat des retours', content: 'Oui (obligatoire)' },
  { title: 'Envoi automatique du formulaire', content: 'Non' },
  { title: 'Relance manuelle (bouton)', content: 'Oui' },
  { title: 'Export CSV', content: 'Oui' },
  { title: "QR code & lien d'accès", content: 'Oui' },
  { title: 'IA - alertes négatives', content: 'Oui' },
  { title: 'IA - alertes positives', content: 'Oui' },
  { title: 'Traite des alertes', content: 'Oui (commentaire possible)' },
  { title: 'Brandig personnalisé', content: 'Non' },
  { title: 'Suppression du logo Izzzi', content: 'Non' },
];

const tableData2 = [
  { title: 'Nombre de classes actives', content: 'Illimité' },
  { title: 'Matières par classe', content: 'Illimité' },
  { title: 'Retours visibles par matière', content: 'Illimité' },
  { title: 'Retours au-delà', content: 'Visibles' },
  { title: 'Anonymat des retours', content: 'Oui + levée possible (bientôt disponible)' },
  { title: 'Envoi automatique du formulaire', content: 'Oui (début + fin) (bientôt disponible)' },
  { title: 'Relance manuelle (bouton)', content: 'Oui' },
  { title: 'Export CSV', content: 'Oui' },
  { title: "QR code & lien d'accès", content: 'Oui' },
  { title: 'IA - alertes négatives', content: 'Oui' },
  { title: 'IA - alertes positives', content: 'Oui' },
  { title: 'Traite des alertes', content: 'Oui + réponse auto par IA' },
  { title: 'Brandig personnalisé', content: 'Oui (bientôt disponible)' },
  { title: 'Suppression du logo Izzzi', content: 'Oui (bientôt disponible)' },
];

const handleSubscription = (planName: string) => {
  if (planName === 'Starter') {
    router.push('/pricing/confirm');
  } else {
    let price = 0;
    if (billingPeriod.value === 'annual') {
      price = Math.round(basePriceAnnual * numberOfClasses.value);
    } else {
      price = Math.round(basePriceMonthly * numberOfClasses.value);
    }
    
    router.push({ 
      name: 'subscription-confirmation', 
      query: { 
        amount: price,
        plan: planName,
        period: billingPeriod.value,
        classes: numberOfClasses.value
      } 
    });
  }
};
</script>

<template>
  <main>
    <h3>Deux plans. Zéro friction.</h3>
    <br />
    <p>Commencez gratuitement et passez au niveau supérieur quand vous êtes prêts.</p>
    <br />
    <SwitchTabs
      :model-value="billingPeriod === 'annual' ? 0 : 1"
      :tabs="[{ name: 'Annuel -30%' }, { name: 'Mensuel' }]"
      @update:model-value="(val) => (billingPeriod = val === 0 ? 'annual' : 'monthly')"
    />
    <SwitchPanels :activeTab="0">
      <template #tab-0>
        <div class="annuel-pricing-wrapper">
          <Card class="annuel-pricing">
            <Button variant="neutral" round>👌🏻 Izzzi</Button>
            <h1>0€<span>/ mois</span></h1>
            <br />
            <Button icon="Arrow" iconPosition="right">Démarrer mes 4 mois gratuits</Button>
            <br /><br />
            <div>
              <ul>
                <li>4 mois d'essai illimités <span>(matières, classes, retours)</span></li>
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
            <br />
            <Button icon="Arrow" iconPosition="right" variant="neutral">Voir les détails du plan</Button>
          </Card>
          <Card class="annuel-pricing annuel-pricing-orange annuel-pricing-desktop">
            <Button variant="primary" round>🙌 Super Izzzi</Button>
            <br />
            <br />
            <h4>Estimez le prix de votre abonnement</h4>
            <div class="slider-container">
              <div class="slider-wrapper">
                <div class="slider-bubble" :style="{ left: `${getSliderPosition(numberOfClasses)}%` }">
                  {{ bubbleText }}
                </div>
                <div class="slider-track">
                  <div class="slider-track-filled" :style="{ width: `${getSliderPosition(numberOfClasses)}%` }"></div>
                </div>
                <input
                  type="range"
                  :min="minClasses"
                  :max="maxClasses"
                  :value="numberOfClasses"
                  :step="1"
                  class="slider"
                  @input="handleSliderChange"
                />
                <div class="slider-marks">
                  <button
                    v-for="(step, index) in sliderSteps"
                    :key="index"
                    type="button"
                    class="slider-mark"
                    :class="{ active: isMarkActive(step) }"
                    :style="{ left: `${((step - minClasses) / (maxClasses - minClasses)) * 100}%` }"
                    @click="handleSliderClick(step)"
                  >
                    <span class="slider-mark-label">{{ step === 20 ? '20+' : step }}</span>
                  </button>
                </div>
              </div>
            </div>
            <h1 v-if="totalPrice !== null">{{ totalPrice }}€<span> par mois</span></h1>
            <br />
            <Button icon="Arrow" iconPosition="right" @click="handleSubscription('Izzzi')">{{ buttonText }}</Button>
            <br />
            <br />
            <div>
              <h4>Tout ce qu'il y a dans le plan gratuit, et en plus :</h4>
              <br />
              <ul>
                <li>Nombre de retours illimité</li>
                <li>IA générative pour répondre aux alertes<span>(un mail prêt à envoyer en un clic)</span></li>
                <li>Levée d'anonymat activable par l'étudiant<span>(Bientôt disponible)</span></li>
                <li>Formulaires personnalisables<span>(Bientôt disponible)</span></li>
                <li>Envoi automatique du formulaire<span>(Bientôt disponible)</span></li>
                <li>
                  Branding personnalisé (couleurs, logo)<span>(Au début et à la fin du cours. Bientôt disponible)</span>
                </li>
                <li>Suppression du logo Izzzi<span>(Bientôt disponible)</span></li>
              </ul>
            </div>
            <br />
            <Button icon="Arrow" iconPosition="right" variant="neutral">Voir les détails du plan</Button>
          </Card>
        </div>
        <h2>Comparez nos plans</h2>
      </template>
    </SwitchPanels>
    <SwitchTabs
      v-model="activeTab2"
      round
      :tabs="[{ name: '👌🏻 Izzzi' }, { name: '🙌 Super Izzzi' }]"
      class="plans-tabs"
    />
    <div class="plans-container">
      <SwitchPanels :activeTab="activeTab2" class="plans-panels-mobile">
        <template #tab-0>
          <Card class="plans">
            <Button variant="neutral" round>👌🏻 Izzzi</Button>
            <div>
              <h3>0€ <span>par mois</span></h3>
              <p class="p10">(4 mois d'essai illimités)</p>
            </div>
            <Button icon="Arrow" iconPosition="right" @click="handleSubscription('Starter')">Démarrer l'essai gratuit</Button>
            <CardTable :rows="tableData" />
          </Card>
        </template>
        <template #tab-1>
          <Card class="plans">
            <Button variant="primary" round>🙌 Super Izzzi</Button>
            <div>
              <p class="p10">À partir de</p>
              <h3>
                {{ billingPeriod === 'annual' ? '19€' : '22€' }}
                <span>par mois / classe</span>
              </h3>
            </div>
            <Button icon="Arrow" iconPosition="right" @click="handleSubscription('Izzzi')">Je choisis ce plan</Button>
            <CardTable :rows="tableData2" />
          </Card>
        </template>
      </SwitchPanels>
      <Card class="plans-desktop plans-card">
        <div class="plan-column">
          <Button variant="neutral" round>👌🏻 Izzzi</Button>
          <div>
            <h3>0€ <span>par mois</span></h3>
            <p class="p10">(4 mois d'essai illimités)</p>
          </div>
          <Button icon="Arrow" iconPosition="right" @click="handleSubscription('Starter')">Démarrer l'essai gratuit</Button>
          <div class="table-wrapper">
            <CardTable :rows="tableData" />
          </div>
        </div>
        <div class="plan-column">
          <Button variant="primary" round>🙌 Super Izzzi</Button>
          <div>
            <p class="p10">À partir de</p>
            <h3>
              {{ billingPeriod === 'annual' ? '19€' : '22€' }}
              <span>par mois / classe</span>
            </h3>
          </div>
          <Button icon="Arrow" iconPosition="right" @click="handleSubscription('Izzzi')">Je choisis ce plan</Button>
          <div class="table-wrapper">
            <CardTable :rows="tableData2" />
          </div>
        </div>
      </Card>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
main {
  margin: 10rem 1rem 0 1rem;
}

.annuel-pricing-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 5rem;
}

.annuel-pricing {
  padding: 3rem;
  display: block;
}

.annuel-pricing-desktop {
  display: none;
}

.annuel-pricing-orange {
  background-color: var(--orange) !important;
  border-color: var(--orange) !important;
}

.annuel-pricing h1 span {
  font-size: 12px;
}

.annuel-pricing ul {
  list-style: url('src/assets/svg/icons/Check-Desktop.svg');
}

.annuel-pricing ul li {
  padding: 0.2rem 1rem;
  line-height: 1.5rem;
}

.annuel-pricing ul li span {
  display: block;
  font-size: 12px;
}

.annuel-pricing .p12 {
  margin-top: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.slider-container {
  margin: 2rem 0;
  position: relative;
}

.slider-wrapper {
  position: relative;
  padding: 3rem 0 4rem 0;
}

.slider-bubble {
  position: absolute;
  top: -2rem;
  transform: translateX(-50%);
  background-color: var(--dark-orange);
  color: var(--white);
  padding: 0.5rem;
  border-radius: 16px;
  font-size: 0.875rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}

.slider-track {
  position: absolute;
  top: 2rem;
  left: 0;
  right: 0;
  height: 8px;
  background: var(--gray-2);
  border-radius: 4px;
  z-index: 1;
}

.slider-track-filled {
  height: 100%;
  background: var(--dark-orange);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: transparent;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  top: 2rem;
  left: 0;
  right: 0;
  z-index: 2;
  margin: 0;
  padding: 0;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--white);
  cursor: pointer;
  border: 3px solid var(--orange);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 3;
  margin-top: -8px;
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--white);
  cursor: pointer;
  border: 3px solid var(--orange);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 3;
}

.slider-marks {
  position: absolute;
  top: 2rem;
  left: 0;
  right: 0;
  height: 8px;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.slider-mark {
  position: absolute;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--white);
  border: 2px solid var(--orange);
  cursor: pointer;
  pointer-events: all;
  padding: 0;
  margin: 0;
  transition: background 0.2s ease;
  top: 50%;
  margin-top: -6px;
}

.slider-mark.active {
  background: var(--orange);
  border-color: var(--orange);
}

.slider-mark-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: var(--gray-100);
  white-space: nowrap;
  pointer-events: none;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.plans-container .button--primary {
  margin:0 auto;
}

.plans-desktop {
  display: none;
}

.plans {
  text-align: center;
}

.plans h3 span {
  font-size: 12px;
  font-family: 'Poppins';
  font-weight: normal;
}

@media (min-width: 1024px) {
  .plans-tabs {
    display: none;
  }

  .plans-panels-mobile {
    display: none;
  }

  .annuel-pricing-wrapper {
    flex-direction: row;
    align-items: stretch;
  }

  .annuel-pricing-desktop {
    display: block;
  }

  .annuel-pricing {
    flex: 1;
  }

  .plans-desktop {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
  }

  .plans-card {
    padding: 3rem;
  }

  .plan-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .table-wrapper {
    padding-top: 2rem;
  }
}
</style>
