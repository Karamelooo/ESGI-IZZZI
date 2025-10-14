import { reactive, readonly } from 'vue';

type ToastType = 'success' | 'positive' | 'negative' | 'info' | 'warning' | 'info-warning' | 'lock' | 'lock-warning';

type Toast = {
    id: number;
    title: string;
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

function show(title: string, message: string, type: ToastType) {
    const toast: Toast = {
        id: idSeq++,
        title,
        message,
        type,
        class: 'toast-'+type,
        duration:5000,
        icon: type === 'success' ? 'Check-Desktop' : type === 'positive' ? 'Love' : type === 'negative' ? 'Warning-Desktop' : type === 'info' ? 'Info-Desktop' : type === 'warning' ? 'Warning-Desktop' : type === 'info-warning' ? 'Info-Desktop' : type === 'lock' ? 'Lock-Desktop' : type === 'lock-warning' ? 'Lock-Desktop' : 'Lock-Desktop'
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
        success: (title: string, message: string) => show(title, message, 'success'),
        positive: (title: string, message: string) => show(title, message, 'positive'),
        negative: (title: string, message: string) => show(title, message, 'negative'),
        info: (title: string, message: string) => show(title, message, 'info'),
        warning: (title: string, message: string) => show(title, message, 'warning'),
        infoWarning: (title: string, message: string) => show(title, message, 'info-warning'),
        lock: (title: string, message: string) => show(title, message, 'lock'),
        lockWarning: (title: string, message: string) => show(title, message, 'lock-warning'),
    }
}