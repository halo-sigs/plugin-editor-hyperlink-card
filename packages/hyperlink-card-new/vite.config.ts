import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      "/apis": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
    },
  },
});
