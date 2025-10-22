<script setup lang="ts"></script>

<template>
  <div class="container"><slot></slot></div>
</template>

<style>
.container {
  border: 1px solid var(--gray-15);
  border-radius: 8px;
  padding: 1rem;
  padding-bottom: 4rem;
  background-color: var(--white);
  margin: 0 1rem;
}
</style>
