import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue({ isProduction: false }), vuetify({ autoImport: true })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
            '#': fileURLToPath(new URL('./src/components', import.meta.url)),
        },
    },
    build: {
        target: 'firefox108',
        emptyOutDir: false, // deletes scripts, which are not rebuild here
        outDir: 'dist/',
        sourcemap: false,
        rollupOptions: {
            input: {
                'popup/popup': './src/popup/popup.html',
                'extension-page/extension-page': './src/extension-page/extension-page.html',
            },
            output: {
                entryFileNames: '[name].js', // popup.js and extension-page.js
            },
        },
    },
})
