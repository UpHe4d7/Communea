import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router)
  .mount('#app')
  //.config.globalProperties.$apiBaseUrl = 'http://192.168.1.101:8088';

