import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

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
