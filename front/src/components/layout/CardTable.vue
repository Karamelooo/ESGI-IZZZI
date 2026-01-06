<script lang="ts" setup>
defineProps<{
  rows: { title: string; content: string }[];
}>();
</script>

<template>
  <table class="card-table">
    <tbody>
      <tr v-for="(row, index) in rows" :key="index" class="card-table-row">
        <td class="card-table-cell">
          <h4>{{ row.title }}</h4>
          <p>{{ row.content }}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.card-table {
  width: 100%;
  border-collapse: collapse;
}

.card-table-row {
  border: 1px solid var(--gray-10);
}

.card-table-row:last-child {
  border-bottom: none;
}

.card-table-cell {
  padding: 1.5rem 0;
  vertical-align: top;
}

.card-table-cell h4 {
  margin-bottom: 0.5rem;
}

.card-table-cell p {
  line-height: 1.5;
  color: var(--gray-100);
}
@media (min-width: 1024px) {
  .card-table-row {
    border-top: 1px solid var(--gray-10);
    border-bottom: 1px solid var(--gray-10);
    border-left: none;
    border-right: none;
  }

  .card-table-row:first-child {
    border-top: 1px solid var(--gray-10);
  }

  .card-table-row:last-child {
    border-bottom: 1px solid var(--gray-10);
  }
}
</style>
