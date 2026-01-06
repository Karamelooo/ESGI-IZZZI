<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { Subject } from '@stores/subjects';

const props = defineProps<{
  subjectItem: Subject;
}>();

const router = useRouter();

const handleFeedbackView = (subjectId: number) => {
  router.push('dashboard/feedbacks/' + subjectId);
};
</script>

<template>
  <Card :fullWidth="true" :padding="20">
    <p>{{ subjectItem.name }}</p>
  </Card>
</template>

<style scoped></style>
