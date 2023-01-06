import { createApp } from 'vue'

import vuetify from '@/plugins/vuetify';
import './extension-page.css'

import App from './App.extension-page.vue'
import { router } from './pages/routes';

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')
