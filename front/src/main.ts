import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

import './assets/css/main.css';

import Button from './components/Button.vue';
import Icon from './components/Icon.vue';
import Input from './components/Input.vue';
import Logo from './components/Logo.vue';
import SwitchPanels from './components/SwitchPanels.vue';
import SwitchTabs from './components/SwitchTabs.vue';
import ToastContainer from './components/ToastContainer.vue';

const app = createApp(App);

app.component('Button', Button);
app.component('Icon', Icon);
app.component('Input', Input);
app.component('Logo', Logo);
app.component('SwitchPanels', SwitchPanels);
app.component('SwitchTabs', SwitchTabs);
app.component('ToastContainer', ToastContainer);

app.use(router);

app.mount('#app');
