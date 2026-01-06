<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useApi } from '@/api/axios';
import Header from '@/components/page/Header.vue';
import Card from '@/components/layout/Card.vue';
import Button from '@/components/base/Button.vue';
import Input from '@/components/base/Input.vue';
import Icon from '@/components/base/Icon.vue';
import { updateMe, updateMyPassword, removeMe } from '@/api/user';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const api = useApi();
const toast = useToast();

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  institution: '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const subscription = ref<any>(null);

onMounted(async () => {
  if (authStore.user) {
    userForm.value.firstName = authStore.user.firstName;
    userForm.value.lastName = authStore.user.lastName;
    userForm.value.email = authStore.user.email;
    userForm.value.institution = authStore.user.institution?.name || '';
  }

  try {
    const { data } = await api.get('/subscription/me');
    subscription.value = data;
  } catch (e) {
    console.log('No active subscription');
  }
});

async function handleUpdateProfile() {
  try {
    await updateMe({
      firstName: userForm.value.firstName,
      lastName: userForm.value.lastName,
      email: userForm.value.email,
    });
    toast.success('Profil mis à jour');
    await authStore.fetchMe();
  } catch (error) {
    toast.negative('Erreur lors de la mise à jour du profil');
  }
}

async function handleUpdatePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.negative('Les mots de passe ne correspondent pas');
    return;
  }

  try {
    await updateMyPassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });
    toast.success('Mot de passe mis à jour');
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  } catch (error) {
    toast.negative('Erreur lors de la mise à jour du mot de passe');
  }
}

async function handleLogout() {
  await authStore.logout();
  router.push('/auth');
}

async function handleDeleteAccount() {
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    try {
      await removeMe();
      toast.success('Compte supprimé');
      await authStore.logout();
      router.push('/auth');
    } catch (error) {
      toast.negative('Erreur lors de la suppression du compte');
    }
  }
}

const userInitials = computed(() => {
  if (!authStore.user) return '';
  return `${authStore.user.firstName.charAt(0)}${authStore.user.lastName.charAt(0)}`.toUpperCase();
});
</script>

<template>
  <div class="profile-page">
    <Header />

    <main class="content">
      <div class="profile-grid">
        <div class="column">
          <Card class="user-summary-card" :spacing="24">
            <div class="avatar-container">
              <div class="avatar-placeholder">
                {{ userInitials }}
                <div class="edit-badge">
                  <Icon name="Pen-Desktop" size="14px" color="var(--black)" />
                </div>
              </div>
            </div>

            <div class="user-info">
              <h3>{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h3>
              <p class="email">{{ authStore.user?.email }}</p>
              <p class="institution">{{ authStore.user?.institution?.name }}</p>
            </div>

            <Button variant="primary" icon="Arrow" iconPosition="right" fullWidth @click="handleLogout">
              Déconnexion
            </Button>
          </Card>

          <Card class="billing-card" :spacing="24">
            <h3>Gérer la facturation</h3>
            <ul class="billing-features">
              <li>
                <Icon name="Check-Desktop" size="16px" color="var(--black)" />
                Gère tes informations de paiement
              </li>
              <li>
                <Icon name="Check-Desktop" size="16px" color="var(--black)" />
                Télécharge tes factures
              </li>
              <li>
                <Icon name="Check-Desktop" size="16px" color="var(--black)" />
                Arrête ton abonnement
              </li>
            </ul>
            <Button variant="neutral" icon="Arrow" iconPosition="right" fullWidth @click="router.push('/pricing')">
              Accéder au tableau de bord
            </Button>
          </Card>
        </div>

        <div class="column">
          <Card class="form-card" :spacing="32">
            <h3>Modifier mes informations personnelles</h3>
            <div class="form-group">
              <label>Prénom</label>
              <Input v-model="userForm.firstName" placeholder="Entrez votre prénom" />
            </div>
            <div class="form-group">
              <label>Nom</label>
              <Input v-model="userForm.lastName" placeholder="Entrez votre nom" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <Input v-model="userForm.email" placeholder="Entrez votre email" />
            </div>
            <div class="form-group">
              <label>Établissement</label>
              <Input v-model="userForm.institution" placeholder="Votre établissement" disabled />
            </div>
            <Button variant="primary" icon="Arrow" iconPosition="right" @click="handleUpdateProfile">
              Modifier
            </Button>
          </Card>
        </div>

        <div class="column">
          <Card class="form-card" :spacing="32">
            <h3>Modifier mon mot de passe</h3>
            <div class="form-group">
              <label>Ancien mot de passe</label>
              <Input v-model="passwordForm.currentPassword" type="password" placeholder="Entrez votre ancien mot de passe" />
            </div>
            <div class="form-group">
              <label>Nouveau</label>
              <Input v-model="passwordForm.newPassword" type="password" placeholder="Entrez votre nouveau mot de passe" />
              <p class="hint">• 8 caractères &nbsp; • 1 minuscule &nbsp; • 1 majuscule</p>
            </div>
            <div class="form-group">
              <label>Confirmez votre nouveau mot de passe</label>
              <Input v-model="passwordForm.confirmPassword" type="password" placeholder="Entrez votre nouveau mot de passe" />
            </div>
            <Button variant="primary" icon="Arrow" iconPosition="right" @click="handleUpdatePassword">
              Modifier
            </Button>
          </Card>

          <Card class="form-card delete-card" :spacing="32">
            <h3>Supprimer mon compte et toutes mes données</h3>
            <Button variant="neutral" icon="Arrow" iconPosition="right" fullWidth @click="handleDeleteAccount">
              Je supprime mon compte
            </Button>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--gray-1);
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-summary-card {
  text-align: center;
  align-items: center;
  width: 100%;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-20);
  position: relative;
}

.edit-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 28px;
  height: 28px;
  background-color: var(--orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-info h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.user-info .email {
  color: var(--gray-60);
  font-size: 14px;
  margin-bottom: 4px;
}

.user-info .institution {
  color: var(--gray-100);
  font-size: 12px;
  font-weight: 600;
}

.billing-card h3, .form-card h3 {
  font-size: 18px;
  font-weight: 700;
}

.billing-features {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.billing-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-100);
}

.hint {
  font-size: 10px;
  color: var(--gray-40);
  margin-top: 4px;
}

@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
