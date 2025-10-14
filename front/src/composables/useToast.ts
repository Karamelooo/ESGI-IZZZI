import { reactive, readonly } from 'vue';

type ToastType = 'success' | 'positive' | 'negative' | 'info' | 'warning' | 'info-warning' | 'lock' | 'lock-warning';

type Toast = {
    id: number;
    message: string;
    type: ToastType;
    class: string;
    duration: number;
    icon: string;
}

const state = reactive({
    toasts: [] as Toast[],
});

let idSeq = 1;

function show(message: string, type: ToastType) {
    const toast: Toast = {
        id: idSeq++,
        message,
        type,
        class: 'toast-'+type,
        duration:5000,
        icon: type === 'success' ? 'Check-Desktop' : type === 'positive' ? 'Check-Desktop' : type === 'negative' ? 'Close' : type === 'info' ? 'Info' : type === 'warning' ? 'Warning' : type === 'info-warning' ? 'Info' : type === 'lock' ? 'Lock' : type === 'lock-warning' ? 'Lock' : 'Check-Desktop'
    }
    state.toasts.push(toast);

    setTimeout(() => remove(toast.id), toast.duration);
}

function remove(id: number) {
    const idx = state.toasts.findIndex((t: Toast) => t.id === id);
    if(idx !== -1) state.toasts.splice(idx, 1);
}

export function useToast() {
    return {
        toasts: readonly(state.toasts),
        show,
        success: (message: string) => show(message, 'success'),
        positive: (message: string) => show(message, 'positive'),
        negative: (message: string) => show(message, 'negative'),
        info: (message: string) => show(message, 'info'),
        warning: (message: string) => show(message, 'warning'),
        infoWarning: (message: string) => show(message, 'info-warning'),
        lock: (message: string) => show(message, 'lock'),
        lockWarning: (message: string) => show(message, 'lock-warning'),
    }
}