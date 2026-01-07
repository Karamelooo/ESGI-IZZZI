<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Modal from '../base/Modal.vue';
import Button from '../base/Button.vue';
import Input from '../base/Input.vue';
import Icon from '../base/Icon.vue';
import { useApi } from '@/api/axios';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const api = useApi();
const email = ref('');
const selectedRole = ref('manager');
const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
];

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string | null; // Role might be null if not loaded or different structure
  UserRole?: { role: { name: string } }[];
}

const users = ref<User[]>([]);

const fetchUsers = async () => {
    try {
        const { data } = await api.get('/users');
        users.value = data;
    } catch (e) {
        console.error('Failed to fetch users', e);
    }
}

const inviteUser = async () => {
  if (!email.value) return;
  try {
      await api.post('/invitations', {
          email: email.value,
          role: selectedRole.value
      });
      email.value = '';
      // Optionally show success message
      alert('Invitation envoyée !');
  } catch (e) {
      console.error('Failed to send invitation', e);
      alert('Erreur lors de l\'envoi de l\'invitation.');
  }
};

const copyLink = async () => {
  try {
      const { data } = await api.post('/invitations', { role: selectedRole.value }); // No email = link generation
      const link = `${window.location.origin}/register?token=${data.token}`;
      await navigator.clipboard.writeText(link);
      alert('Lien copié dans le presse-papier !');
  } catch (e) {
      console.error('Failed to generate link', e);
  }
};

onMounted(() => {
    fetchUsers();
});

const getInitials = (user: User) => {
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
}

const getUserRole = (user: User) => {
    const userRole = user.userRoles?.[0];
    if (userRole) {
        const roleName = userRole.role.name;
        // capitalize
        const formatted = roleName.charAt(0).toUpperCase() + roleName.slice(1);
        // Translate specific roles if needed
        if (formatted === 'Owner') return 'Propriétaire';
        return formatted;
    }
    return 'Membre'; // Fallback
}

const colors = ['#F25C05', '#F2994A', '#2F80ED', '#27AE60', '#EB5757', '#9B51E0'];
const getUserColor = (id: number) => colors[id % colors.length];

</script>

<template>
  <Modal :isOpen="isOpen" title="Partager" @close="emit('close')">
    <div class="invite-container">
      <div class="invite-header">
        <h3>Inviter des collaborateurs</h3>
        <Button variant="neutral" @click="copyLink" icon="Copy" iconPosition="right">Copier le lien</Button>
      </div>

      <div class="invite-form">
        <Input v-model="email" placeholder="Inviter par email..." class="email-input" />
        <div class="role-select-wrapper">
            <select v-model="selectedRole" class="role-select">
            <option v-for="role in roles" :key="role.value" :value="role.value">
                {{ role.label }}
            </option>
            </select>
            <Icon name="Arrowdown" class="select-icon" />
        </div>
      </div>

      <Button variant="primary" class="invite-submit-btn" @click="inviteUser">
        Inviter <Icon name="Arrow" />
      </Button>

      <div class="users-list-section">
        <h4>Personnes disposant de l'accès</h4>
        <div class="users-list">
          <div v-for="user in users" :key="user.id" class="user-item">
            <div class="user-avatar" :style="{ backgroundColor: getUserColor(user.id) }">
              {{ getInitials(user) }}
            </div>
            <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
            <div class="user-role-wrapper">
                <span class="user-role-badge">{{ getUserRole(user) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.invite-container {
  min-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.invite-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.invite-form {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 12px;
}

.role-select-wrapper, .user-role-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.role-select {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  border: 1px solid var(--gray-15);
  border-radius: 6px;
  appearance: none;
  background-color: white;
  cursor: pointer;
  font-family: inherit;
}

.select-icon {
    position: absolute;
    right: 10px;
    pointer-events: none;
    width: 12px;
    height: 12px;
}

.invite-submit-btn {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
}

.users-list-section h4 {
  font-size: 0.9rem;
  color: var(--gray-60);
  margin-bottom: 12px;
  font-weight: 600;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  min-width: 32px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.user-name {
  flex-grow: 1;
  font-weight: 500;
}

.user-role-badge {
    padding: 4px 12px;
    background-color: var(--gray-2);
    border-radius: 12px;
    font-size: 0.85rem;
    color: var(--gray-80);
}

/* Adjustments to match global styles if needed */
:global(.modal-content) {
    max-width: 600px;
}
</style>
