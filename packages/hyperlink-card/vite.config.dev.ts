import presetIcons from '@unocss/preset-icons';
import { presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    UnoCSS({
      mode: 'shadow-dom',
      presets: [presetUno(), presetIcons()],
    }),
  ],
});
