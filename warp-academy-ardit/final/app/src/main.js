import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'mosha-vue-toastify/dist/style.css'


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
