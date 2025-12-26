import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import type { Linter } from "eslint";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

const vueConfig = defineConfigWithVueTs(
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  {
    name: "app/vue-files",
    files: ["ui/**/*.vue", "ui/**/*.ts"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }
);

export default [
  includeIgnoreFile(gitignorePath),
  {
    name: "app/global-ignores",
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/build/**",
      "**/bin/**",
      "./workplace/**",
      "./src/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.ts",
    ],
  },

  js.configs.recommended,

  {
    name: "app/base-config",
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  ...tseslint.configs.recommended,

  ...vueConfig,

  ...svelte.configs["flat/recommended"],
  {
    name: "app/svelte-files",
    files: ["packages/hyperlink-card/**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "svelte/no-target-blank": "error",
      "svelte/no-at-debug-tags": "warn",
      "svelte/no-reactive-functions": "warn",
      "svelte/no-reactive-literals": "warn",
    },
  },

  {
    name: "app/svelte-ts-files",
    files: ["packages/hyperlink-card/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  prettier,
  skipFormatting,
] as Linter.Config[];
