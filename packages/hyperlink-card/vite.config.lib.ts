import presetIcons from '@unocss/preset-icons';
import { presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'hyperlink-card',
      fileName: 'hyperlink-card',
      formats: ['iife', 'es'],
    },
    emptyOutDir: true,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  plugins: [
    UnoCSS({
      mode: 'shadow-dom',
      presets: [presetUno(), presetIcons()],
    }),
    dts(),
    copy({
      targets: [
        {
          src: './dist/hyperlink-card.iife.js',
          dest: fileURLToPath(new URL('../../src/main/resources/static', import.meta.url)),
        },
      ],
    }),
  ],
});
