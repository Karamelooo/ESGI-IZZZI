<template>
  <div class="chart-container">
    <div class="header">
      <h3>{{ title }}</h3>
      <div class="legend-item">
        <span class="color-box"></span>
        <span class="legend-text">{{ legendLabel }}</span>
      </div>
    </div>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = withDefaults(
  defineProps<{
    title: string;
    legendLabel: string;
    labels: string[];
    data: number[];
  }>(),
  {
    title: '',
    legendLabel: 'Note globale',
    labels: () => [],
    data: () => [],
  }
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.legendLabel,
      backgroundColor: '#f69d04',
      borderRadius: 6,
      data: props.data,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
  ],
}));

const chartOptions = computed(() => {
  const maxVal = Math.max(...props.data, 5);
  return {
    responsive: true,
    maintainAspectRatio: false,
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
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxVal * 1.2),
        grid: {
          color: '#f0f0f0',
          borderDash: [4, 4],
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Poppins' },
          color: '#2f2e2c',
          stepSize: 1,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          color: '#f0f0f0',
          borderDash: [4, 4],
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Poppins' },
          color: '#2f2e2c',
        },
        border: {
          display: false,
        },
      },
    },
  };
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 16px;
  height: 16px;
  background-color: #f69d04;
  border-radius: 4px;
}

.legend-text {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: var(--gray-100);
}

.chart-wrapper {
  flex: 1;
  min-height: 200px;
  width: 100%;
}
</style>
