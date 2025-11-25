import { fileURLToPath } from "url";
import { defineConfig, Plugin } from "vite";
import { viteStaticCopy as StaticCopy } from "vite-plugin-static-copy";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { minify } from "terser";

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
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    svelte(),
    minifyBundle(),
    StaticCopy({
      targets: [
        {
          src: ["./dist/index.iife.js", "./dist/index.css"],
          dest: fileURLToPath(new URL("../../src/main/resources/static", import.meta.url)),
        },
      ],
    }),
  ],
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
