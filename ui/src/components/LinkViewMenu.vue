<script setup lang="ts">
import type { Editor } from "@halo-dev/richtext-editor";
import type { Component } from "vue";
import { linkViewTypes } from "@/editor/index";
import type { LinkViewType } from "@/editor/index";

const props = defineProps<{
  editor: Editor;
  isActive?: ({ editor }: { editor: Editor }) => boolean;
  visible?: ({ editor }: { editor: Editor }) => boolean;
  action?: ({ editor }: { editor: Editor }) => Component | void;
  type: ({ editor }: { editor: Editor }) => LinkViewType;
}>();

const handleSwitchLinkViewType = (item: LinkViewType) => {
  if (isActiveType(item)) {
    return;
  }
  item.action({ editor: props.editor });
};

const isActiveType = (item: LinkViewType) => {
  return props.type?.({ editor: props.editor }).key === item.key || false;
};
</script>
<template>
  <ul class="flex flex-col">
    <li
      v-for="item in linkViewTypes"
      :key="item.key"
      class="inline-flex cursor-pointer select-none items-center rounded-md p-1 m-0.5 gap-x-1 text-base hover:bg-gray-100"
      :class="{ '!bg-gray-200 !text-black': isActiveType(item) }"
      @click="handleSwitchLinkViewType(item)"
    >
      <component :is="item.icon" class="h-5 w-5" />
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>
