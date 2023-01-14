import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const baseConfig = {
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      include: ["src/scripts/**/*", "src/util/**/*"],
      compilerOptions: {
        moduleResolution: 'node',
      }
    }),
    terser(),
  ],
  output: {
    entryFileNames: "[name].js",
    dir: './dist/scripts/',
    inlineDynamicImports: true,
    format: 'iife',
    sourcemap: true,
  },
}
const config = defineConfig([
  {
    ...baseConfig,
    input: {
      'background': "./src/scripts/background/background.ts"
    },
  },{
    ...baseConfig,
    input: {
      'content': "./src/scripts/content/content.ts",
    },
  }
]);

export default config;