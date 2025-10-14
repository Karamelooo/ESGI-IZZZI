<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import Icon from './Icon.vue' 

const props = withDefaults(
    defineProps<{
        type?: 'button' | 'submit' | 'reset';
        variant?: 'primary' | 'neutral' | 'plain';
        size?: 'small' | 'medium';
        icon?: string;
        disabled?: boolean;
    }>(),
    {
        type: 'button',
        variant: 'primary',
        size: 'medium',
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
        emit('click', event);
    }
};
</script>

<template>
    <button
        :class="['button', `button--${variant}`, `button--${size}`]"
        :type="type"
        :disabled="disabled"
        @click="handleClick"
    >
    <div class="container-button">
        <slot />
        <Icon v-if=icon :name="icon" />
    </div>
    </button>
</template>

<style scoped>
/* Base styles */
.button {
    color: var(--gray-100);
    padding: 16px 26px;
    border-radius: 8px;
    cursor: pointer;

    transition:
        background-color 0.2s ease-in-out,
        border-color 0.2s ease-in-out,
        color 0.2s ease-in-out;
}

.container-button {
    display:flex;
    gap:16px;
    align-items:center;
}

/* Size variants */
.button--small {
    padding: 10px 16px;
    font-size: 14px;
}

/* Disabled state */
.button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* Primary variant */
.button--primary {
    background-color: var(--primary);
    border: 1px solid var(--primary);
}

.button--primary:hover {
    background-color: var(--secondary);
}

.button--primary:disabled:hover {
    background-color: var(--primary);
}

/* Neutral variant */
.button--neutral {
    background-color: var(--gray-2);
    border: 1px solid var(--gray-10);
}

.button--neutral:hover {
    background-color: var(--gray-10);
}

.button--neutral:disabled:hover {
    background-color: var(--gray-2);
}

/* Plain variant */
.button--plain {
    background-color: transparent;
    border: none;
    padding: 0;
}

.button--plain:hover {
    text-decoration: underline;
}

.button--plain:disabled:hover {
    text-decoration: none;
}
</style>
