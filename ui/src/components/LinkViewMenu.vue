<script setup lang="ts">
import type { Editor } from "@halo-dev/richtext-editor";
import type { Component } from "vue";
import linkViewTypes, { type LinkViewType } from "@/editor/link-view-type";

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
  <ul class=":uno: flex flex-col space-y-1.5">
    <li
      v-for="item in linkViewTypes"
      :key="item.key"
      class=":uno: group flex flex-row cursor-pointer items-center gap-3 rounded px-1.5 py-1 hover:bg-gray-100"
      :class="{ ':uno: !bg-gray-100': isActiveType(item) }"
      @click="handleSwitchLinkViewType(item)"
    >
      <component
        :is="item.icon"
        class=":uno: size-7 rounded bg-gray-100 p-1.5 group-hover:bg-white"
        :class="{ ':uno: !bg-white': isActiveType(item) }"
      />
      <span
        class=":uno: text-sm text-gray-600 group-hover:text-gray-900 group-hover:font-medium"
        :class="{ ':uno: !font-medium !text-gray-900': isActiveType(item) }"
      >
        {{ item.title }}
      </span>
    </li>
  </ul>
</template>
