import presetIcons from '@unocss/preset-icons';
import { presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';

export const sharedPluginsConfig = [
  UnoCSS({
    mode: 'shadow-dom',
    presets: [presetUno(), presetIcons()],
    shortcuts: {
      'bg-card': 'bg-[var(--halo-hyperlink-card-bg-color,#fff)]',
      'border-card': 'border-[var(--halo-hyperlink-card-border-color,#e4e4e7)]',
      'border-hover-card': 'hover:border-[var(--halo-hyperlink-card-border-hover-color,#818cf8)]',
      'text-title': 'text-[var(--halo-hyperlink-card-title-color,#18181b)]',
      'text-description': 'text-[var(--halo-hyperlink-card-description-color,#71717a)]',
      'text-link': 'text-[var(--halo-hyperlink-card-link-color,#4f46e5)]',

      'bg-inline-card': 'bg-[var(--halo-hyperlink-card-inline-bg-color,#fafafa)]',
      'bg-hover-inline-card': 'hover:bg-[var(--halo-hyperlink-card-inline-hover-bg-color,#f4f4f5)]',
      'text-inline-title': 'text-[var(--halo-hyperlink-card-inline-title-color,#27272a)]',

      'bg-skeleton': 'bg-[var(--halo-hyperlink-card-skeleton-color,#e4e4e7)]',
    },
  }),
];
