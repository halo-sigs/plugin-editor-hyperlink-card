import copy from 'rollup-plugin-copy';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { sharedPluginsConfig } from './src/vite/shared-plugin-config';

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
    ...sharedPluginsConfig,
    dts(),
    copy({
      targets: [
        {
          src: ['./dist/hyperlink-card.iife.js', './var.css'],
          dest: fileURLToPath(new URL('../../src/main/resources/static', import.meta.url)),
        },
      ],
    }),
  ],
});
