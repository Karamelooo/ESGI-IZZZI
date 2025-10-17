<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

type Rule =
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'hasUppercase'; message?: string }
  | { type: 'hasDigit'; message?: string }
  | { type: 'hasSymbol'; message?: string }
  | { type: 'email'; message?: string };

const ALLOWED_TYPES = ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'textarea'];

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    type?: string;
    label?: string;
    placeholder?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    iconLeft?: string;
    iconRight?: string;
    rules?: Rule[];
  }>(),
  {
    type: 'text',
    name: '',
    disabled: false,
    required: false,
    rules: () => [],
  }
);

const isFocused = ref(false);
const hasBeenTouched = ref(false);
const isPasswordVisible = ref(false);

const showPasswordToggle = computed(() => {
  return normalizedType.value === 'password' && !props.iconRight;
});

const normalizedType = computed(() => {
  return ALLOWED_TYPES.includes(props.type) ? props.type : 'text';
});

const inputType = computed(() => {
  if (normalizedType.value === 'password') {
    return isPasswordVisible.value ? 'text' : 'password';
  }
  return normalizedType.value;
});

const isTextArea = computed(() => normalizedType.value === 'textarea');

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus', event: FocusEvent): void;
}>();

function onInput(event: Event) {
  if (!hasBeenTouched.value) hasBeenTouched.value = true;
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}

function onFocus(event: FocusEvent) {
  if (!hasBeenTouched.value) hasBeenTouched.value = true;
  isFocused.value = true;
  emit('focus', event);
}

function onBlur() {
  isFocused.value = false;
}

const inputId = computed(() => props.name ?? `input-${Math.random().toString(36).slice(2, 10)}`);

const emailRule = { type: 'email' as const };

const rulesResults = computed(() => {
  const value = typeof props.modelValue === 'string' ? props.modelValue : String(props.modelValue ?? '');
  const propRules = [...(props.rules || [])];

  if (normalizedType.value === 'email') {
    const hasEmailRule = propRules.some((rule) => (rule as any).type === 'email');
    if (!hasEmailRule) propRules.push(emailRule);
  }

  return propRules.map((rule) => {
    switch (rule.type) {
      case 'minLength':
        return {
          valid: value.length >= rule.value,
          message: rule.message ?? `${rule.value} caractère${rule.value > 1 ? 's' : ''} min.`,
        };
      case 'maxLength':
        return {
          valid: value.length <= rule.value,
          message: rule.message ?? `${rule.value} caractère${rule.value > 1 ? 's' : ''} max.`,
        };
      case 'hasUppercase':
        return {
          valid: /[A-Z]/.test(value),
          message: rule.message ?? `Majuscule requise`,
        };
      case 'hasDigit':
        return {
          valid: /[0-9]/.test(value),
          message: rule.message ?? `Chiffre requis`,
        };
      case 'hasSymbol':
        return {
          valid: /[!@#$%^&*(),.?":{}|<>_\-+=~`\\\/[\];']/g.test(value),
          message: rule.message ?? `Symbole requis`,
        };
      case 'email':
        return {
          valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: rule.message ?? 'Email valide',
        };
      default:
        return { valid: true, message: '' };
    }
  });
});

const hasRuleError = computed(() => hasBeenTouched.value && rulesResults.value.some((r) => !r.valid));
const wrapperClass = computed(() => ({
  'input--error': !!props.error || hasRuleError.value,
  'input--focused': isFocused.value,
}));
</script>

<template>
  <div class="input-wrapper" :class="wrapperClass">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required">*</span>
    </label>

    <div class="input-container">
      <span v-if="iconLeft && !isTextArea" class="input-icon input-icon--left">
        <Icon :name="iconLeft" />
      </span>

      <template v-if="isTextArea">
        <textarea
          :id="inputId"
          class="input"
          rows="4"
          :placeholder="placeholder"
          :name="name"
          :disabled="disabled"
          :required="required"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        >
          {{ modelValue }}
        </textarea>
      </template>

      <template v-else>
        <input
          :id="inputId"
          class="input"
          :type="inputType"
          :placeholder="placeholder"
          :name="name"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </template>

      <span v-if="iconRight && !isTextArea" class="input-icon input-icon--right">
        <Icon :name="iconRight" />
      </span>

      <span
        v-else-if="showPasswordToggle && !isTextArea"
        class="input-icon input-icon--right input-icon--clickable"
        @mousedown.prevent="isPasswordVisible = true"
        @mouseup.prevent="isPasswordVisible = false"
        @mouseleave="isPasswordVisible = false"
        @touchstart.prevent="isPasswordVisible = true"
        @touchend.prevent="isPasswordVisible = false"
        style="cursor: pointer"
        tabindex="0"
      >
        <Icon name="Eyes" />
      </span>
    </div>

    <div v-if="error" class="input-error">{{ error }}</div>

    <ul v-if="rulesResults.length" class="input-rules">
      <li v-for="(rule, i) in rulesResults" :key="i" :class="{ 'input-rule--error': hasBeenTouched && !rule.valid }">
        • {{ rule.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 14px;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--gray-15);
  border-radius: 6px;
  padding: 8px 12px;
  transition: border-color 0.2s;
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-container:has(.input:disabled) {
  cursor: not-allowed;
  background-color: var(--gray-2);
}

.input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  min-width: 0;
  resize: none;
}

textarea.input {
  resize: vertical;
  min-height: 25px;
  max-height: 240px;
}

.input--focused .input-container {
  border-color: var(--primary);
}

.input--error .input-container {
  border-color: var(--error);
}

.input-error {
  font-size: 12px;
  color: var(--error);
}

.input-icon {
  display: inline-flex;
  align-items: center;
}

.input-icon--clickable {
  cursor: pointer;
  user-select: none;
}

.input-rules {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 12px;
  color: var(--gray-60);
}

.input-rule--error {
  color: var(--error);
}
</style>
