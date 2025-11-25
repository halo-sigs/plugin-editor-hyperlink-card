<script lang="ts" setup>
import { BlockActionSeparator, type Editor } from "@halo-dev/richtext-editor";
import type { Component } from "vue";
import type { LinkViewType } from "@/editor/link-view-type";
import LinkViewBubbleMenuItem from "./LinkViewBubbleMenuItem.vue";

const props = withDefaults(
  defineProps<{
    editor: Editor;
    isActive?: ({ editor }: { editor: Editor }) => boolean;
    visible?: ({ editor }: { editor: Editor }) => boolean;
    action?: ({ editor }: { editor: Editor }) => Component | void;
    type?: ({ editor }: { editor: Editor }) => LinkViewType;
  }>(),
  {
    isActive: () => false,
    // @unocss-skip-start
    visible: () => true,
    // @unocss-skip-end
    action: undefined,
    type: undefined,
  }
);
</script>
<template>
  <template v-if="visible({ editor })">
    <BlockActionSeparator />
    <LinkViewBubbleMenuItem v-bind="props" />
    <BlockActionSeparator />
  </template>
</template>
