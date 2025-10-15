<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from './composables/useToast';

const toast = useToast();
const activeTab = ref(0);
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

        <h3>Onglets</h3>
        <Switch
            v-model="activeTab"
            :tabs="[
                { name: 'Onglet 1' },
                { name: 'Onglet 2' },
                { name: 'Onglet 3' },
            ]"
        >
            <template #tab-0> Onglet 1 (slot) </template>
            <template #tab-1> Onglet 2 (slot) </template>
            <template #tab-2> Onglet 3 (slot) </template>
        </Switch>

        <h3>Toasts</h3>
        <div class="row">
            <Button @click="toast.success('Lorem ipsum.')">Success</button><br>
            <Button @click="toast.positive('Lorem', 'Lorem ipsum.')">Positive</button><br>
            <Button @click="toast.negative('Lorem', 'Lorem ipsum.')">Negative</button><br>
            <Button @click="toast.info('Lorem ipsum.')">Info</button><br>
            <Button @click="toast.warning('Lorem', undefined, undefined, 'Lorem ipsum.')">Warning</button><br>
            <Button @click="toast.infoWarning('Lorem ipsum.')">InfoWarning</button><br>
            <Button @click="toast.lock('Lorem ipsum.')">Lock</button><br>
            <Button @click="toast.lockWarning('Lorem ipsum.')">LockWarning</button><br>
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
