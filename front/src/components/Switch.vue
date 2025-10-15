<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
    modelValue: number;
    tabs: { name: string }[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
}>();

const activeTab = computed(() => props.modelValue);

const setTab = (index: number) => {
    emit('update:modelValue', index);
};
</script>

<template>
    <div class="switch">
        <div class="switch-tabs">
            <Button
                v-for="(tab, index) in tabs"
                :key="index"
                :variant="activeTab === index ? 'switch' : 'plain'"
                :inSwitchComponent="true"
                @click="setTab(index)"
            >
                {{ tab.name }}
            </Button>
        </div>
        <div class="switch-content">
            <slot :name="`tab-${activeTab}`"></slot>
        </div>
    </div>
</template>

<style scoped>
.switch {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.switch-tabs {
    display: flex;
    gap: 20px;
}

.switch-content {
    margin-top: 12px;
}
</style>
