<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { useClassesStore } from '@stores/classes';

const router = useRouter();
const authStore = useAuthStore();
const classesStore = useClassesStore();
const headerActiveTab = ref(0);

onMounted(async () => {
  const institutionId = authStore.user?.institution.id;

  if (institutionId) {
    await classesStore.fetchClasses(institutionId);
  } else {
    router.push('/auth');
  }
});
</script>

<template>
  <div class="page">
    <Header
      :activeTab="headerActiveTab"
      :disabled="classesStore.classes.length === 0"
      @update:activeTab="headerActiveTab = $event"
    />

    <SwitchPanels :activeTab="headerActiveTab" class="switch-panels">
      <template #tab-0>
        <div v-if="classesStore.classes.length > 0">
          <pre>{{ JSON.stringify(classesStore.classes, null, 2) }}</pre>
        </div>
        <Card v-else :fullWidth="true" :fullHeight="true" :centered="true" :spacing="36">
          <h2>Pour commencer,<br />créez une classe</h2>
          <Button icon="Arrow" iconPosition="right" @click="router.push('/classes/new')">Je créé une classe</Button>
        </Card>
      </template>
    </SwitchPanels>
  </div>
</template>

<style scoped></style>
