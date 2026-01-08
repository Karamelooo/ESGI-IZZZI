import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useClickOutside(component: Ref<HTMLElement | null>, callback: () => void) {
  if (!component) return;

  const listener = (event: Event) => {
    if (event.target !== component.value && event.composedPath().includes(component.value as HTMLElement)) return;
    if (typeof callback === 'function') {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener('click', listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });
}
