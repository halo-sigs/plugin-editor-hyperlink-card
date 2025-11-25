import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "@unocss/svelte-scoped/preprocess";

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  preprocess: [
    vitePreprocess(),
    UnoCSS({
      configOrPath: "./uno.config.ts",
    }),
  ],
  compilerOptions: {
    customElement: true,
  },
};
