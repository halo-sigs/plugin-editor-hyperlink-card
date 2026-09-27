import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";
import path from "node:path";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";

const OUT_DIR_PROD = "build/dist";
const OUT_DIR_DEV = "../../build/resources/main/console";

export default viteConfig({
  manifestPath: "../../src/main/resources/plugin.yaml",
  vite: ({ mode }) => {
    return {
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "src"),
        },
      },
      build: {
        outDir: mode === "production" ? OUT_DIR_PROD : OUT_DIR_DEV,
      },
      plugins: [
        Icons({
          compiler: "vue3",
        }),
        UnoCSS({
          mode: "vue-scoped",
          configFile: "./uno.config.ts",
        }),
      ],
    };
  },
});
