import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

import './assets/css/main.css';

import Button from './components/Button.vue';
import CheckBox from './components/CheckBox.vue';
import CheckBoxGroup from './components/CheckBoxGroup.vue';
import Icon from './components/Icon.vue';
import Loader from './components/Loader.vue';
import Live from './components/Live.vue';
import Banderole from './components/Banderole.vue';
import Input from './components/Input.vue';
import Logo from './components/Logo.vue';
import Radio from './components/Radio.vue';
import RadioGroup from './components/RadioGroup.vue';
import SwitchPanels from './components/SwitchPanels.vue';
import SwitchTabs from './components/SwitchTabs.vue';
import ToastContainer from './components/ToastContainer.vue';

const app = createApp(App);

app.component('Button', Button);
app.component('CheckBox', CheckBox);
app.component('CheckBoxGroup', CheckBoxGroup);
app.component('Icon', Icon);
app.component('Loader', Loader);
app.component('Live', Live);
app.component('Banderole', Banderole);
app.component('Input', Input);
app.component('Logo', Logo);
app.component('Radio', Radio);
app.component('RadioGroup', RadioGroup);
app.component('SwitchPanels', SwitchPanels);
app.component('SwitchTabs', SwitchTabs);
app.component('ToastContainer', ToastContainer);

app.use(router);

app.mount('#app');
