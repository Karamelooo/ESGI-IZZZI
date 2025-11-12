import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@router';

import App from '@/App.vue';
import '@css/main.css';

const app = createApp(App);
const pinia = createPinia();

const components = {
  ...import.meta.glob('@components/base/*.vue', { eager: true }),
  ...import.meta.glob('@components/layout/*.vue', { eager: true }),
};

Object.entries(components as Record<string, { default: any }>).forEach(([path, module]) => {
  const fileName: string | undefined = path.split('/').pop();
  if (!fileName) return;

  const componentName: string = fileName.replace('.vue', '');
  app.component(componentName, module.default);
});

app.use(pinia);
app.use(router);
app.mount('#app');
