import { createApp } from 'vue';
import './assets/css/main.css';
import App from './App.vue';
import Button from './components/Button.vue';
import SwitchTabs from './components/SwitchTabs.vue';
import SwitchPanels from './components/SwitchPanels.vue';
import Icon from './components/Icon.vue';
import ToastContainer from './components/ToastContainer.vue';

const app = createApp(App);

app.component('Icon', Icon);
app.component('Button', Button);
app.component('SwitchTabs', SwitchTabs);
app.component('SwitchPanels', SwitchPanels);
app.component('ToastContainer', ToastContainer);

app.mount('#app');
