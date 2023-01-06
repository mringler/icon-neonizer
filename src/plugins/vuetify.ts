
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { createVuetify } from 'vuetify';

import { en } from 'vuetify/locale';

// Misc
//import { loadFonts } from './webfontloader';
//loadFonts();

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  // Global configuration
  // https://next.vuetifyjs.com/en/features/global-configuration/
  /*
  defaults: {
    global: {
      ripple: false,
    },
    VSheet: {
      elevation: 4,
    },
  },
  */
  // Icon Fonts
  // https://next.vuetifyjs.com/en/features/icon-fonts/
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  // Internationalization (i18n)
  // https://next.vuetifyjs.com/en/features/internationalization/#internationalization-i18n
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { en },
  },
  // Theme
  // https://next.vuetifyjs.com/en/features/theme/
  theme: {
    defaultTheme: 'dark',
    themes:{
        dark:{
            colors: {
                //primary: '#009999'
            }
        }
    }
  },
});
