<script lang="ts" setup>
interface TableColumn {
  key: string;
  label: string;
}

interface TableRow {
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    columns: Array<TableColumn>;
    rows: Array<TableRow>;
    striped?: boolean;
  }>(),
  {
    striped: false,
  }
);
</script>

<template>
  <div class="table-container">
    <table class="table" :class="{ 'table--striped': striped }">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="col in columns" :key="col.key" :class="{ 'table--unstriped': !striped }">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  background-color: var(--white);
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead th {
  font-family: 'Mochiy Pop One';
  font-weight: 400;
  font-size: 14px;
  padding: 24px 32px;
  background-color: var(--gray-2);
}

tbody td {
  padding: 12px 32px;
  font-size: 14px;
}

tbody td.table--unstriped {
  border-bottom: 1px solid var(--gray-15);
}

tbody tr:last-child td {
  border-bottom: none;
}

.table--striped thead th {
  background-color: var(--white);
}

.table--striped tbody tr:nth-child(odd) {
  background-color: var(--gray-2);
}

.table--striped tbody tr:nth-child(even) {
  background-color: var(--white);
}
</style>
