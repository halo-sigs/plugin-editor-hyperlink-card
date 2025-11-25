import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import type { Linter } from "eslint";
import pluginVue from "eslint-plugin-vue";

export default defineConfigWithVueTs(
  {
    name: "app/global-ignores",
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/build/**",
      "./workplace/**",
      "./src/**",
      "./bin/**",
    ],
  },

  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,

  skipFormatting
) as Linter.Config;
