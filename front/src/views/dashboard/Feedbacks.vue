<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import { fetchFormStatistics, type FormStatistics, type GroupDistribution } from '@api/forms';
import TrialBanner from '@components/page/TrialBanner.vue';
import DoughnutChart from '@components/charts/DoughnutChart.vue';
import BarChart from '@components/charts/BarChart.vue';
import LineChart from '@components/charts/LineChart.vue';

const route = useRoute();
const authStore = useAuthStore();

const statistics = ref<FormStatistics | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const formId = computed(() => route.params.id as string);

onMounted(async () => {
  try {
    statistics.value = await fetchFormStatistics(formId.value);
  } catch (e) {
    error.value = 'Impossible de charger les statistiques.';
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const ratingTrendDatasets = computed(() => {
  if (!statistics.value) return [];
  return [
    { label: 'Moyenne', data: statistics.value.temporal.avgRatings, pointBackgroundColor: '#f26103' },
    { label: 'Min', data: statistics.value.temporal.minRatings, pointBackgroundColor: '#ffe552' },
    { label: 'Max', data: statistics.value.temporal.maxRatings, pointBackgroundColor: '#2f2e2c' },
  ];
});

const submissionCountDatasets = computed(() => {
  if (!statistics.value) return [];
  return [{ label: 'Réponses', data: statistics.value.temporal.submissionCounts, pointBackgroundColor: '#f26103' }];
});

const allCourseQuestions = computed(() => {
  if (!statistics.value) return [];
  return statistics.value.courseContentDistributions.flatMap((g: GroupDistribution) => g.questions);
});

const allInstructorQuestions = computed(() => {
  if (!statistics.value) return [];
  return statistics.value.instructorPedagogyDistributions.flatMap((g: GroupDistribution) => g.questions);
});

const shareUrl = computed(() => `${window.location.origin}/form/${formId.value}`);

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareUrl.value);
};
</script>

<template>
  <div class="page">
    <Header />
    <TrialBanner v-if="authStore.user?.subscription?.plan === 'Izzzi'" />

    <div class="page-content">
      <div class="fb-content">
        <div class="fb-header">
          <h2>Retours des étudiants</h2>
          <IconTextList
            v-if="statistics"
            :items="[
              { icon: 'Laptop', text: statistics.metadata.subjectName },
              { icon: 'People', text: statistics.metadata.className },
              { icon: 'School', text: statistics.metadata.institutionName },
            ]"
          />
          <IconTextList
            v-else
            :items="[
              { icon: 'Laptop', text: 'Chargement...' },
              { icon: 'People', text: '' },
              { icon: 'School', text: '' },
            ]"
          />
        </div>

        <div v-if="loading" class="fb-loading">
          <p>Chargement des statistiques...</p>
        </div>

        <div v-else-if="error" class="fb-error">
          <p>{{ error }}</p>
        </div>

        <template v-else-if="statistics">
          <div class="fb-section">
            <h3>Récap' temporel</h3>
            <div class="fb-charts">
              <Card :padding="24" :spacing="24" :fullWidth="true">
                <LineChart
                  title="Note moyenne sur 5 jours"
                  :labels="statistics.temporal.labels"
                  :datasets="ratingTrendDatasets"
                />
              </Card>
              <Card :padding="24" :spacing="24" :fullWidth="true">
                <LineChart
                  title="Nombre de réponses par jour"
                  :labels="statistics.temporal.labels"
                  :datasets="submissionCountDatasets"
                />
              </Card>
            </div>
          </div>

          <div class="fb-section">
            <h3>Le cours</h3>
            <div class="fb-charts">
              <Card :padding="24" :spacing="24" :fullWidth="true">
                <BarChart
                  title="Distribution des notes globales"
                  legendLabel="Réponses"
                  :labels="statistics.ratingDistribution.labels"
                  :data="statistics.ratingDistribution.counts"
                />
              </Card>
              <Card v-for="q in allCourseQuestions" :key="q.questionId" :fullWidth="true">
                <DoughnutChart :title="q.questionLabel" :labels="q.options" :data="q.counts" />
              </Card>
            </div>
          </div>

          <div class="fb-section">
            <h3>Pédagogie et intervenant</h3>
            <div class="fb-charts">
              <Card
                v-for="q in allInstructorQuestions"
                :key="q.questionId"
                :padding="24"
                :spacing="24"
                :fullWidth="true"
              >
                <DoughnutChart :title="q.questionLabel" :labels="q.options" :data="q.counts" />
              </Card>
            </div>
          </div>
        </template>
      </div>

      <Card :padding="28" :spacing="24" class="fb-sidebar">
        <div class="fb-sidebar-content">
          <h3>Partager le questionnaire</h3>
          <p>Partagez ce lien aux étudiants pour obtenir plus de réponses, ou téléchargez le QR code.</p>
          <Input :value="shareUrl" :disabled="true" @click="copyToClipboard" />
          <Button variant="plain" icon="Import" iconPosition="right">Télécharger le QR code</Button>
        </div>

        <div class="fb-sidebar-content">
          <h3>Exporter les retours</h3>
          <p>Exportez les retours dans le format de votre choix (.CSV ou .XLSX).</p>
          <Button icon="Arrowdown" iconPosition="right">Exporter les retours</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  flex-direction: row;
  gap: 24px;
}

.fb-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 2;
}

@media (min-width: 1650px) {
  .fb-content {
    flex: 3;
  }
}

.fb-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fb-header h2 {
  font-size: 28px;
  font-weight: 400;
}

.fb-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fb-section h3 {
  font-size: 18px;
  font-weight: 400;
}

.fb-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1650px) {
  .fb-charts {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

:deep(.chart-container h3) {
  font-weight: 400;
}

.fb-loading,
.fb-error {
  padding: 40px;
  text-align: center;
}

.fb-error {
  color: var(--error);
}

.fb-sidebar {
  flex: 1;
  align-self: flex-start;
}

.fb-sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fb-sidebar-content h3 {
  font-size: 18px;
  font-weight: 400;
}

.fb-sidebar-content p {
  font-size: 12px;
  line-height: 1.5;
}
</style>
