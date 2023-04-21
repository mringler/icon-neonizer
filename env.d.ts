/// <reference types="vite/client" />

// Vuetify color fix.
declare module 'vuetify/lib/util/colors.mjs'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
