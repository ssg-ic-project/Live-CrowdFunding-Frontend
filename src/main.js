import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; 
import './assets/styles/style.css';
import 'swiper/swiper-bundle.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // pinia를 먼저 추가
app.use(router);
app.mount('#app');