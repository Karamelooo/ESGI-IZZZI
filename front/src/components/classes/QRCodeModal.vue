<script lang="ts" setup>
import { ref, watch } from 'vue';
import QRCode from 'qrcode';

const props = defineProps<{
  isOpen: boolean;
  url: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const qrCodeDataUrl = ref<string>('');
const error = ref<string | null>(null);

const generateQRCode = async () => {
  if (!props.url) return;

  try {
    error.value = null;
    qrCodeDataUrl.value = await QRCode.toDataURL(props.url, {
      width: 300,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    error.value = 'Impossible de générer le QR code.';
  }
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      generateQRCode();
    }
  }
);

watch(
  () => props.url,
  () => {
    if (props.isOpen) {
      generateQRCode();
    }
  }
);
</script>

<template>
  <Modal
    :isOpen="isOpen"
    title="Accès direct au formulaire"
    cancelText="Fermer"
    cancelVariant="primary"
    @close="emit('close')"
  >
    <div class="qrcode-container">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <Card v-if="qrCodeDataUrl" :padding="20">
        <img :src="qrCodeDataUrl" alt="QR Code" />
      </Card>
      <div v-else class="loading">Génération en cours...</div>
    </div>
  </Modal>
</template>

<style scoped>
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
}

.url-text {
  font-size: 12px;
  color: var(--gray-40);
  text-align: center;
  word-break: break-all;
  max-width: 100%;
}

.error-message {
  color: var(--error);
}
</style>
