<template>
  <div class="chart-container">
    <h3>{{ title }}</h3>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface LineDataset {
  label: string;
  data: number[];
  borderColor?: string;
  pointBackgroundColor?: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    labels: string[];
    datasets: LineDataset[];
  }>(),
  {
    title: '',
    labels: () => [],
    datasets: () => [],
  }
);

const defaultColors = ['#f26103', '#ffe552', '#2f2e2c'];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds, idx) => ({
    label: ds.label,
    backgroundColor: ds.pointBackgroundColor || defaultColors[idx % defaultColors.length],
    borderColor: ds.borderColor || '#2f2e2c',
    pointBackgroundColor: ds.pointBackgroundColor || defaultColors[idx % defaultColors.length],
    pointBorderColor: ds.pointBackgroundColor || defaultColors[idx % defaultColors.length],
    pointRadius: 6,
    pointHoverRadius: 8,
    data: ds.data,
    tension: 0,
    borderWidth: 1,
  })),
}));

const chartOptions = computed(() => {
  const allData = props.datasets.flatMap((ds) => ds.data);
  const maxVal = Math.max(...allData, 5);
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.datasets.length > 1,
        labels: {
          font: { family: 'Poppins' },
          color: '#2f2e2c',
        },
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
.chart-wrapper {
  flex: 1;
  min-height: 200px;
  width: 100%;
}
</style>
