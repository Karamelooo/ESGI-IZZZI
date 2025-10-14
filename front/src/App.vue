<script lang="ts" setup>
import Button from './components/Button.vue';
import { useToast } from './composables/useToast';
import ToastContainer from './components/ToastContainer.vue'

const toast = useToast();
</script>
<template>
    <ToastContainer />
    <div id="root">
        <h1>UI Kit — © IZZZI 2025.</h1>

        <h3>Boutons</h3>
        <div class="row">
            <Button>Primaire</Button>
            <Button :disabled="true">Primaire — désactivé</Button>
            <Button variant="neutral">Neutre</Button>
            <Button variant="neutral" :disabled="true">Neutre — désactivé</Button>
            <Button variant="plain">Sans fond</Button>
            <Button variant="plain" :disabled="true">Sans fond — désactivé</Button>
        </div>
        <div class="row">
            <Button size="small">Primaire</Button>
            <Button size="small" :disabled="true">Primaire — désactivé</Button>
            <Button size="small" variant="neutral">Neutre</Button>
            <Button size="small" variant="neutral" :disabled="true">Neutre — désactivé</Button>
            <Button size="small" variant="plain">Sans fond</Button>
            <Button size="small" variant="plain" :disabled="true">Sans fond — désactivé</Button>
        </div>
        <h3>Toasts</h3>
        <div class="row">
            <Button @click="toast.success('Les étudiants ont bien été relancés.')">Success</button><br>
            <Button  @click="toast.positive('Alerte', 'Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.')">Positive</button><br>
            <Button  @click="toast.negative('Alerte', 'Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.')">Negative</button><br>
            <Button  @click="toast.info('Plan actuel.')">Info</button><br>
            <Button  @click="toast.warning('Période d’essai terminée :\n changez de plan pour débloquer les retours illimités.')">Warning</button><br>
            <Button  @click="toast.infoWarning('Les étudiants ont bien été relancés.')">InfoWarning</button><br>
            <Button  @click="toast.lock('Les étudiants ont bien été relancés.')">Lock</button><br>
            <Button  @click="toast.lockWarning('Les étudiants ont bien été relancés.')">LockWarning</button><br>
        </div>
    </div>
</template>

<style scoped>
#root {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 12px 20px;
}

.row {
    display: flex;
    gap: 20px;
}
</style>
