import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
            '#': fileURLToPath(new URL('./src/components', import.meta.url)),
        },
    },
    build: {
        target: 'firefox108',
        emptyOutDir: false,
        outDir: 'dist/',
        sourcemap: true,
        rollupOptions: {
            input: {
                'popup/popup': './src/popup/popup.html',
                'extension-page/extension-page': './src/extension-page/extension-page.html',
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
})
