import { defineConfig } from 'vite';
import { sharedPluginsConfig } from './src/vite/shared-plugin-config';

export default defineConfig({
  plugins: [...sharedPluginsConfig],
  server: {
    proxy: {
      '/apis': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
});
