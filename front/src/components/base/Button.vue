<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    link?: string;
    width?: 'fill' | 'fit';
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'neutral' | 'plain' | 'switch';
    icon?: string;
    iconOnly?: boolean;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    inSwitchComponent?: boolean;
  }>(),
  {
    width: 'fill',
    type: 'button',
    variant: 'primary',
    iconOnly: false,
    iconPosition: 'left',
    disabled: false,
    inSwitchComponent: false,
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
  <router-link v-if="link" :to="link" custom v-slot="{ navigate, href }">
    <button
      :class="[
        'button',
        `button--${variant}`,
        `button--width-${width}`,
        { 'button--in-switch': inSwitchComponent, 'button--icon-only': iconOnly },
      ]"
      :type="type"
      :disabled="disabled"
      :href="href"
      @click="
        (event) => {
          handleClick(event);
          navigate(event);
        }
      "
    >
      <div class="button-container" :style="{ gap: variant === 'plain' ? '10px' : '' }">
        <Icon v-if="icon && iconPosition === 'left'" :name="icon" />
        <slot v-if="!iconOnly" />
        <Icon v-if="icon && iconPosition === 'right'" :name="icon" />
      </div>
    </button>
  </router-link>
  <button
    v-else
    :class="[
      'button',
      `button--${variant}`,
      `button--width-${width}`,
      { 'button--in-switch': inSwitchComponent, 'button--icon-only': iconOnly },
    ]"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <div class="button-container" :style="{ gap: variant === 'plain' ? '10px' : '' }">
      <Icon v-if="icon && iconPosition === 'left'" :name="icon" />
      <slot v-if="!iconOnly" />
      <Icon v-if="icon && iconPosition === 'right'" :name="icon" />
    </div>
  </button>
</template>

<style scoped>
.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

/* Base styles */
.button {
  color: var(--gray-100);
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    padding-left 0.2s ease-in-out,
    padding-right 0.2s ease-in-out;
}

/* Width variants */
.button--width-fill {
  width: 100%;
}

.button--width-fit {
  width: fit-content;
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
  border-radius: 0;
  padding: 0;
}

.button--plain:hover {
  text-decoration: underline;
}

.button--plain:disabled:hover {
  text-decoration: none;
}

/* Switch variant */
.button--switch {
  background-color: var(--gray-100);
  border: 1px solid var(--gray-100);
  color: var(--gray-2);
  padding: 12px 60px;
}

.button--plain.button--in-switch {
  padding: 0 30px;
  border-radius: 0;
  height: -webkit-fill-available;
  height: -moz-available;
  height: fill-available;
}

@media (max-width: 600px) {
  .button--in-switch {
    padding: 12px 36px;
  }
}

.button--icon-only {
  width: 43px;
  height: 43px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
