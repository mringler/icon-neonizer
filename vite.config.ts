import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    typescript({
      types: [
        "firefox-webext-browser"
      ]
    }),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/app', import.meta.url))
    }
  },
  build: {
    target: "firefox108",
    emptyOutDir: false,
    outDir: "dist/",
    sourcemap: true,
    rollupOptions: {
      input: {
        'background/background': "./src/background/background.ts",
        'content/content': "./src/content/content.ts",
        'popup/configure': "./src/popup/configure.html",
      },
      output: {
        entryFileNames: "[name].js",
        //inlineDynamicImports: true,
      },
    },
  },
})
