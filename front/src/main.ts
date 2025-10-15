import { createApp } from 'vue';
import './assets/css/main.css';
import App from './App.vue';
import Button from './components/Button.vue';
import Switch from './components/Switch.vue';
import Icon from './components/Icon.vue';
import ToastContainer from './components/ToastContainer.vue';

const app = createApp(App);

app.component('Button', Button);
app.component('Switch', Switch);
app.component('Icon', Icon);
app.component('ToastContainer', ToastContainer);

app.mount('#app');
