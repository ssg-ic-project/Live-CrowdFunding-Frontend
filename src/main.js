// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';  // 추가
import App from './App.vue';
import router from './router';

import './assets/styles/style.css';
import 'swiper/swiper-bundle.css';

const app = createApp(App);
// const pinia = createPinia();  // 추가

// app.use(pinia);  // 추가
app.use(router);
app.mount('#app');