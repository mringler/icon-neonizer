import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({ isProduction: false }),
        vuetify({ autoImport: true }),
        checker({vueTsc: true,}),
        {
            name: 'remove-src-from-html',
            enforce: 'post',
            generateBundle(_,bundle){
                const pattern = /^src\/.*\.html$/
                for(const outputItem of Object.values(bundle)){
                    if(!pattern.test(outputItem.fileName)){
                        continue
                    }
                    outputItem.fileName = outputItem.fileName.replace('src/', '')
                }
            }
        }
    ],
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
        cssCodeSplit: false,
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
