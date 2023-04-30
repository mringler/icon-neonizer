import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { en } from 'vuetify/locale'
import { VDataTable } from 'vuetify/labs/VDataTable'

// Misc
//import { loadFonts } from './webfontloader';
//loadFonts();

import 'vuetify/styles'

const defaultTheme = window?.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'

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
        defaultTheme,
        themes: {
            dark: {
                colors: {
                    info:  '#04d9ff',
                    success: '#0fff50',
                },
            },
            light:{
                colors: {
                    primary: '#7d12ff',
                    info:  '#04d9ff',
                    success: '#0fff50',
                },
            }
        },
    },
    components: {
        VDataTable,
    },
})
