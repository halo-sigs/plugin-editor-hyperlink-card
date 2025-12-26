<script lang="ts" setup>
import type { LinkViewType } from "@/editor/link-view-type";
import {
  BlockActionSeparator,
  BubbleItemComponentProps,
  type Editor,
} from "@halo-dev/richtext-editor";
import LinkViewBubbleMenuItem from "./LinkViewBubbleMenuItem.vue";

const props = withDefaults(
  defineProps<
    BubbleItemComponentProps & { type?: ({ editor }: { editor: Editor }) => LinkViewType }
  >(),
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
    <BlockActionSeparator :editor="editor" />
    <LinkViewBubbleMenuItem v-bind="props" />
    <BlockActionSeparator :editor="editor" />
  </template>
</template>
