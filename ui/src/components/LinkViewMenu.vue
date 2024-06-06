<script setup lang="ts">
import linkViewTypes, { type LinkViewType } from '@/editor/link-view-type';
import type { Editor } from '@halo-dev/richtext-editor';
import type { Component } from 'vue';

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
  <ul class="hyperlink-flex hyperlink-flex-col hyperlink-space-y-1.5">
    <li
      v-for="item in linkViewTypes"
      :key="item.key"
      class="hyperlink-group hyperlink-flex hyperlink-cursor-pointer hyperlink-flex-row hyperlink-items-center hyperlink-gap-3 hyperlink-rounded hyperlink-px-1.5 hyperlink-py-1 hover:hyperlink-bg-gray-100"
      :class="{ '!hyperlink-bg-gray-100': isActiveType(item) }"
      @click="handleSwitchLinkViewType(item)"
    >
      <component
        :is="item.icon"
        class="hyperlink-size-7 hyperlink-rounded hyperlink-bg-gray-100 hyperlink-p-1.5 group-hover:hyperlink-bg-white"
        :class="{ '!hyperlink-bg-white': isActiveType(item) }"
      />
      <span
        class="hyperlink-text-sm hyperlink-text-gray-600 group-hover:hyperlink-font-medium group-hover:hyperlink-text-gray-900"
        :class="{ '!hyperlink-font-medium !hyperlink-text-gray-900': isActiveType(item) }"
      >
        {{ item.title }}
      </span>
    </li>
  </ul>
</template>
