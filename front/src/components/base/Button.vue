<script lang="ts" setup>
export type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'plain' | 'switch';

const props = withDefaults(
  defineProps<{
    link?: string;
    width?: 'fill' | 'fit';
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
    icon?: string;
    iconOnly?: boolean;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    inSwitchComponent?: boolean;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    round?: boolean;
  }>(),
  {
    width: 'fit',
    type: 'button',
    variant: 'primary',
    iconOnly: false,
    iconPosition: 'left',
    disabled: false,
    inSwitchComponent: false,
    flipHorizontal: false,
    flipVertical: false,
    round: false,
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
        { 'button--in-switch': inSwitchComponent, 'button--icon-only': iconOnly, 'button--round': round },
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
        <Icon
          v-if="icon && iconPosition === 'left'"
          :name="icon"
          :flip-horizontal="flipHorizontal"
          :flip-vertical="flipVertical"
        />
        <slot v-if="!iconOnly" />
        <Icon
          v-if="icon && iconPosition === 'right'"
          :name="icon"
          :flip-horizontal="flipHorizontal"
          :flip-vertical="flipVertical"
        />
      </div>
    </button>
  </router-link>
  <button
    v-else
    :class="[
      'button',
      `button--${variant}`,
      `button--width-${width}`,
      { 'button--in-switch': inSwitchComponent, 'button--icon-only': iconOnly, 'button--round': round },
    ]"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <div class="button-container" :style="{ gap: variant === 'plain' ? '10px' : '' }">
      <Icon
        v-if="icon && iconPosition === 'left'"
        :name="icon"
        :flip-horizontal="flipHorizontal"
        :flip-vertical="flipVertical"
      />
      <slot v-if="!iconOnly" />
      <Icon
        v-if="icon && iconPosition === 'right'"
        :name="icon"
        :flip-horizontal="flipHorizontal"
        :flip-vertical="flipVertical"
      />
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


.button--width-fill {
  width: 100%;
}

.button--width-fit {
  width: fit-content;
}


.button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}


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


.button--secondary {
  background-color: var(--orange);
  border: 1px solid var(--orange);
}

.button--secondary:hover {
  background-color: var(--dark-orange);
}


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


.button--switch {
  background-color: var(--gray-100);
  border: 1px solid var(--gray-100);
  color: var(--gray-2);
  padding: 12px 60px;
}


.button--round {
  border-radius: 50px;
  font-family: 'Mochiy Pop One', sans-serif;
  padding: 12px 24px;
}

.button--round.button--plain {
  background-color: transparent;
  border: 1px solid var(--gray-15);
  color: var(--gray-100);
  padding: 12px 24px;
}

.button--round.button--plain:hover {
  background-color: var(--gray-10);
  text-decoration: none;
}

.button--round.button--switch {
  background-color: var(--black);
  border-color: var(--black);
  color: var(--white);
  padding: 12px 24px;
}

.button--round.button--switch:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-100);
}

.button--plain.button--in-switch {
  padding: 0 30px;
  border-radius: 0;
  height: -webkit-fill-available;
  height: -moz-available;
  height: fill-available;
}

.button--round.button--plain.button--in-switch {
  padding: 12px 24px;
  border-radius: 50px;
  height: auto;
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
