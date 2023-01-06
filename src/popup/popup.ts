import { createApp } from 'vue'

import vuetify from '../plugins/vuetify';
import './popup.css'

import App from './App.popup.vue'

createApp(App)
    .use(vuetify)
    .mount('#app')
