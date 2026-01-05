<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
import { useApi } from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/layout/Card.vue';
import Button from '@/components/base/Button.vue';
import Input from '@/components/base/Input.vue';
import CheckBox from '@/components/base/CheckBox.vue';
import Icon from '@/components/base/Icon.vue';
import Footer from '@/components/page/Footer.vue';

const route = useRoute();
const router = useRouter();
const api = useApi();
const authStore = useAuthStore();

const isPaymentSuccess = ref(false);
const subscriptionDetails = ref<any>(null);

const numberOfClasses = ref(Number(route.query.classes) || 1);
const billingPeriod = ref<'annual' | 'monthly'>((route.query.period as 'annual' | 'monthly') || 'annual');

const basePriceMonthly = 22 / 7;
const basePriceAnnual = 17 / 7;

const totalPrice = computed(() => {
  if (billingPeriod.value === 'annual') {
    return Math.round(basePriceAnnual * numberOfClasses.value);
  }
  return Math.round(basePriceMonthly * numberOfClasses.value);
});

const totalPriceYear = computed(() => {
  return totalPrice.value * 12;
});

const billingEmail = ref(authStore.user?.email || '');
const lastName = ref(authStore.user?.lastName || '');
const firstName = ref(authStore.user?.firstName || '');
const address = ref('123, rue de la Paix');
const addressComplement = ref('');
const city = ref('Paris');
const postalCode = ref('75001');
const country = ref('France');
const acceptedTerms = ref(false);

const paymentOptions = computed(() => [
  {
    label: `Payez mensuellement - ${Math.round(basePriceMonthly * numberOfClasses.value)}€ par mois/classe`,
    value: 'monthly',
  },
  {
    label: `Payez annuellement - ${Math.round(basePriceAnnual * numberOfClasses.value)}€ par mois/classe`,
    value: 'annual',
  },
]);

const handlePaymentPeriodChange = (value: string) => {
  billingPeriod.value = value as 'annual' | 'monthly';
};

const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const checkPaymentStatus = async () => {
  const clientSecret = route.query.payment_intent_client_secret as string;
  const redirectStatus = route.query.redirect_status as string;

  console.log('Checking payment status:', { clientSecret, redirectStatus });

  if (clientSecret && redirectStatus === 'succeeded') {
    isPaymentSuccess.value = true;
    console.log('Payment succeeded. Attempting to save subscription...');
    try {
        const paymentIntentId = route.query.payment_intent as string;
        
        console.log('Sending subscription data to backend:', {
            paymentIntentId,
            plan: route.query.plan,
            billingPeriod: billingPeriod.value,
            numberOfClasses: numberOfClasses.value
        });

        const response = await api.post('/subscription', {
            paymentIntentId,
            plan: route.query.plan || 'Super Izzzi',
            billingPeriod: billingPeriod.value,
            numberOfClasses: numberOfClasses.value,
            address: address.value,
            city: city.value,
            postalCode: postalCode.value,
            country: country.value,
            email: billingEmail.value,
            firstName: firstName.value,
            lastName: lastName.value
        });
        
        console.log('Subscription saved successfully:', response.data);

        subscriptionDetails.value = {
            plan: 'Super Izzzi',
            period: billingPeriod.value,
            amount: totalPrice.value,
            date: new Date().toLocaleDateString(),
            nextPayment: billingPeriod.value === 'annual' 
              ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()
              : new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()
        };
    } catch (e: any) {
        console.error("Failed to record subscription", e);
        if (e.response) {
            console.error("Backend error response:", e.response.data);
            errorMessage.value = `Erreur backend: ${JSON.stringify(e.response.data)}`;
        } else {
            errorMessage.value = "Paiement réussi mais échec de l'enregistrement.";
        }
    }
  } else {
      console.log('No payment success params found or status not succeeded.');
  }
};

onMounted(async () => {
  await authStore.fetchMe();
  if (!authStore.isAuthenticated) {
    router.push('/auth'); 
    return;
  }

  billingEmail.value = authStore.user?.email || '';
  firstName.value = authStore.user?.firstName || '';
  lastName.value = authStore.user?.lastName || '';

  await checkPaymentStatus();
  if (isPaymentSuccess.value) return;

  if (!STRIPE_PUBLIC_KEY) {
    errorMessage.value = "Configuration Stripe manquante.";
    return;
  }

  stripe.value = await loadStripe(STRIPE_PUBLIC_KEY);

  if (!stripe.value) {
    errorMessage.value = "Impossible de charger Stripe.";
    return;
  }

  try {
    const { data } = await api.post('/payment/intent', {
      amount: totalPrice.value * 100,
    });

    const clientSecret = data.clientSecret;

    elements.value = stripe.value.elements({ clientSecret });

    const paymentElement = elements.value.create('payment');
    paymentElement.mount('#payment-element');
  } catch (error) {
    console.error('Error fetching clientSecret', error);
    errorMessage.value = "Erreur lors de l'initialisation du paiement.";
  }
});

const handleSubmit = async () => {
  if (!acceptedTerms.value) {
    alert('Veuillez accepter les Conditions Générales de Vente');
    return;
  }
  
  if (!stripe.value || !elements.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: `${window.location.origin}/pricing/confirm?plan=${route.query.plan}&classes=${numberOfClasses.value}&period=${billingPeriod.value}`, 
      payment_method_data: {
        billing_details: {
          name: `${firstName.value} ${lastName.value}`,
          email: billingEmail.value,
          address: {
            line1: address.value,
            city: city.value,
            postal_code: postalCode.value,
            country: 'FR',
          }
        }
      }
    },
  });

  if (error) {
    errorMessage.value = error.message || "Une erreur est survenue lors du paiement.";
    isLoading.value = false;
  }
};

</script>

<template>
  <main class="subscription-confirmation">
    <div v-if="isPaymentSuccess" class="success-content">
      <div class="confirmation-header">
        <h1>Paiement confirmé !</h1>
        <p>Vous êtes passé au plan Super Izzzi.<br>Merci pour votre confiance.</p>
      </div>
      <div class="confirmation-content">
        <Card class="subscription-plan-card">
           <div class="plan-badge">
            <Button variant="primary" round>🙌 Super Izzzi</Button>
           </div>
           <h2>Détail de votre abonnement</h2>
           <div class="details-grid" v-if="subscriptionDetails">
             <div>
                <strong>Plan</strong>
                <p>Super Izzzi – Paiement {{ billingPeriod === 'annual' ? 'annuel' : 'mensuel' }}</p>
             </div>
             <div>
                <strong>Moyen de paiement</strong>
                <p>Stripe</p>
             </div>
             <div>
                <strong>Montant payé</strong>
                <p>{{ totalPrice }}€ TTC</p>
             </div>
             <div>
                <strong>Prochain paiement</strong>
                <p>{{ subscriptionDetails?.nextPayment }}</p>
             </div>
           </div>
           <div v-else class="loading-details">
             <p>Chargement des détails...</p>
           </div>
        </Card>
        
        <Card class="actions-card">
           <h2>Ce que vous pouvez faire maintenant</h2>
           <ul class="features-list">
             <li><Icon name="Check-Desktop" /> Accéder à vos classes et retours en illimités</li>
             <li><Icon name="Check-Desktop" /> Télécharger votre facture</li>
           </ul>
           <Button variant="primary" to="/dashboard">Accéder à mon dashboard</Button>
           <Button variant="neutral">Télécharger ma facture <Icon name="Download" /></Button>
        </Card>
      </div>
    </div>

    <div v-else class="confirmation-header">
      <h1>Confirmez votre abonnement</h1>
      <p>Vérifiez les détails de votre commande avant de procéder au paiement</p>
    </div>

    <div v-if="!isPaymentSuccess" class="confirmation-content">
      <Card class="confirmation-left">
        <div class="subscription-plan-card">
          <div class="plan-badge">
            <Button variant="primary" round>🙌 Super Izzzi</Button>
          </div>
          <h2>Passez au plan Super Izzzi</h2>
          <p>Changez de plan pour débloquer les retours illimités</p>
        </div>

        <div class="billing-info-card">
          <h3>Email de facturation</h3>
          <Input v-model="billingEmail" type="email" name="billing-email" />
          <h3>Nom</h3>
          <Input v-model="lastName" type="text" name="last-name" />
          <h3>Prénom</h3>
          <Input v-model="firstName" type="text" name="first-name" />
        </div>

        <div class="card-info-card">
          <h3>Informations de carte</h3>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div id="payment-element">
          </div>
        </div>

        <div class="address-card">
          <h3>Adresse de facturation</h3>
          <Input v-model="address" type="text" name="address" />
          <Input v-model="addressComplement" type="text" name="address-complement" placeholder="Étage, bâtiment..." />
          <div class="address-row">
            <Input v-model="city" type="text" name="city" />
            <Input v-model="postalCode" type="text" name="postal-code" />
          </div>
          <Input v-model="country" type="text" name="country" />
        </div>
      </Card>

      <div class="confirmation-right">
        <Card class="payment-summary-card">
          <div class="payment-options">
            <div
              v-for="(option, index) in paymentOptions"
              :key="index"
              class="payment-option"
              :class="{ active: billingPeriod === option.value }"
              @click="handlePaymentPeriodChange(option.value)"
            >
              <div class="payment-option-content">
                <div class="radio-wrapper">
                  <input
                    type="radio"
                    :name="'payment-period'"
                    :value="option.value"
                    :checked="billingPeriod === option.value"
                    @change="handlePaymentPeriodChange(option.value)"
                  />
                </div>
                <div class="payment-option-text">
                  <div class="payment-option-label">{{ option.label.split(' - ')[0] }}</div>
                  <div class="payment-option-price">{{ option.label.split(' - ')[1] }}</div>
                </div>
                <div v-if="option.value === 'annual'" class="payment-badge">-30%</div>
              </div>
            </div>
          </div>

          <div class="total-section">
            <span>Total</span>
            <span class="total-price">{{ totalPrice }}€/mois TTC</span>
          </div>

          <div class="terms-section">
            <CheckBox v-model="acceptedTerms" label="J'accepte les Conditions Générales de Vente" />
            <a href="#" class="cgv-link">(CGV)</a>
          </div>

          <Button 
            variant="primary" 
            @click="handleSubmit" 
            class="submit-button"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Traitement...' : `Valider et payer ${totalPriceYear}€/an (ou ${totalPrice}€/mois)` }}
          </Button>

          <div class="security-info">
            <Icon name="Check-Desktop" />
            <span>Paiement sécurisé via Stripe</span>
          </div>

          <div class="legal-disclaimers">
            <p>
              En souscrivant à ce plan, vous renoncez expressément à votre droit de rétractation conformément à
              l'article L221-28 du Code de la consommation.
            </p>
            <p>
              L'abonnement sera renouvelé automatiquement chaque année/mois, sauf résiliation avant la date de
              renouvellement.
            </p>
          </div>
        </Card>
      </div>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.subscription-confirmation {
  margin: 10rem 1rem 0 1rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 3rem;
}

.confirmation-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.confirmation-header p {
  font-size: 1rem;
  color: var(--gray-100);
}

.confirmation-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 5rem;
}

.confirmation-left,
.confirmation-right {
  display: flex;
  flex-direction: column;
}

.confirmation-left div {
  gap:0;
  padding:0;
}

.subscription-plan-card {
  padding: 2rem;
}

.subscription-plan-card h2 {
  margin-bottom: 0.5rem;
}

.subscription-plan-card p {
  color: var(--gray-100);
}

.billing-info-card,
.card-info-card,
.address-card {
  padding: 2rem;
}

.billing-info-card h3,
.card-info-card h3,
.address-card h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.card-row,
.address-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-summary-card {
  padding: 2rem;
  position: sticky;
  top: 2rem;
}

.payment-summary-card h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-option {
  border: 1px solid var(--gray-15);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: var(--gray-100);
}

.payment-option.active {
  border-color: var(--primary);
  background-color: var(--secondary);
}

.payment-option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.radio-wrapper {
  display: flex;
  align-items: center;
}

.radio-wrapper input[type='radio'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.payment-option-text {
  flex: 1;
}

.payment-option-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.payment-option-price {
  font-size: 0.875rem;
  color: var(--gray-100);
}

.payment-badge {
  background-color: var(--primary);
  color: var(--gray-100);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.terms-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--gray-10);
  border-bottom: 1px solid var(--gray-10);
  margin: 1.5rem 0;
}

.total-price {
  font-weight: bold;
  font-size: 1.25rem;
}

.cgv-link {
  color: var(--gray-100);
  text-decoration: underline;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.submit-button {
  width: 100%;
  margin: 1.5rem 0;
  padding: 1rem;
  font-size: 1rem;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: var(--gray-100);
}

.legal-disclaimers {
  margin-top: 2rem;
  font-size: 0.75rem;
  color: var(--gray-100);
  line-height: 1.5;
}

.legal-disclaimers p {
  margin-bottom: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .confirmation-content {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
