import { svelte } from "@sveltejs/vite-plugin-svelte";
import { minify } from "terser";
import { defineConfig, type Plugin } from "vite";

// See https://github.com/vitejs/vite/issues/6555
const minifyBundle = (): Plugin => ({
  name: "minify-bundle",
  async generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type === "chunk") {
        const code = (await minify(asset.code, { sourceMap: false })).code;
        if (code) {
          asset.code = code;
        }
      }
    }
  },
});

export default defineConfig({
  plugins: [svelte(), minifyBundle()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "hyperlink-card",
      fileName: "index",
      formats: ["es", "iife"],
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
