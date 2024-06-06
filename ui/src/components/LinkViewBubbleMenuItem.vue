<script lang="ts" setup>
import LinkViewMenu from '@/components/LinkViewMenu.vue';
import type { LinkViewType } from '@/editor/link-view-type';
import type { Editor } from '@halo-dev/richtext-editor';
import { Dropdown as VDropdown } from 'floating-vue';
import type { Component } from 'vue';
import MdiMenuDown from '~icons/mdi/menu-down';

const props = withDefaults(
  defineProps<{
    editor: Editor;
    isActive?: ({ editor }: { editor: Editor }) => boolean;
    visible?: ({ editor }: { editor: Editor }) => boolean;
    action?: ({ editor }: { editor: Editor }) => Component | void;
    type: ({ editor }: { editor: Editor }) => LinkViewType;
  }>(),
  {
    isActive: () => false,
    visible: () => true,
    action: undefined,
    type: undefined,
  }
);
</script>

<template>
  <template v-if="visible({ editor })">
    <VDropdown class="hyperlink-inline-flex" :triggers="['click']" :popper-triggers="['click']">
      <button
        :class="{ 'hyperlink-bg-gray-200 !hyperlink-text-black': isActive({ editor }) }"
        class="hyperlink-inline-flex hyperlink-h-full hyperlink-items-center hyperlink-gap-x-1 hyperlink-rounded-md hyperlink-p-2 hyperlink-text-base hyperlink-text-gray-600 hover:hyperlink-bg-gray-100"
      >
        <component :is="type?.({ editor }).icon" class="hyperlink-size-5" />
        <span>{{ type?.({ editor }).title }}</span>
        <MdiMenuDown />
      </button>
      <template #popper>
        <div
          class="hyperlink-relative hyperlink-max-h-96 hyperlink-w-56 hyperlink-overflow-hidden hyperlink-overflow-y-auto hyperlink-rounded-md hyperlink-bg-white hyperlink-p-1 hyperlink-drop-shadow"
        >
          <KeepAlive>
            <LinkViewMenu v-bind="props"></LinkViewMenu>
          </KeepAlive>
        </div>
      </template>
    </VDropdown>
  </template>
</template>
<style>
.v-popper__popper.v-popper__popper--show-from .v-popper__wrapper {
  transform: scale(0.9);
}

.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  transform: none;
  transition: transform 0.1s;
}
</style>
