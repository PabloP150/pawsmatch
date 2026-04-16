import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import router from './router';
import './style.css';
import App from './App.vue';

createApp(App)
  .use(router)
  .use(MotionPlugin)
  .mount('#app');
