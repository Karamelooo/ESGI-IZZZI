<template>
  <div class="chart-container">
    <h3>{{ title }}</h3>
    <div class="chart-content">
      <div class="chart-wrapper">
        <Doughnut :data="chartData" :options="options" />
      </div>
      <div class="custom-legend">
        <div v-for="(item, index) in labels" :key="index" class="legend-item">
          <span class="color-box" :style="{ backgroundColor: colors[index % colors.length] }"></span>
          <span class="label-text">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = withDefaults(
  defineProps<{
    title: string;
    labels: string[];
    data: number[];
  }>(),
  {
    title: '',
    labels: () => [],
    data: () => [],
  }
);

const colors = ['#f26103', '#ffe552', '#f69d04', '#2f2e2c', '#153278'];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: colors.slice(0, props.labels.length),
      data: props.data,
      borderWidth: 0,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#2f2e2c',
      titleFont: { family: 'Poppins' },
      bodyFont: { family: 'Poppins' },
      padding: 10,
      cornerRadius: 4,
    },
  },
};
</script>

<style scoped>
.chart-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.chart-wrapper {
  flex: 0 0 160px;
  height: 160px;
  position: relative;
}

.custom-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.color-box {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  margin-top: 3px;
  flex-shrink: 0;
}

.label-text {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: var(--gray-100);
  line-height: 1.4;
}
</style>
