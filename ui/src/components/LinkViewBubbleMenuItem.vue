<script lang="ts" setup>
import LinkViewMenu from '@/components/LinkViewMenu.vue';
import type { LinkViewType } from '@/editor/link-view-type';
import type { Editor } from '@halo-dev/richtext-editor';
import { VDropdown } from '@halo-dev/components';
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
    <VDropdown class=":uno: inline-flex" :triggers="['click']" :popper-triggers="['click']">
      <button
        :class="{ ':uno: bg-gray-200 !text-black': isActive({ editor }) }"
        class=":uno: h-full inline-flex items-center gap-x-1 rounded-md p-2 text-base text-gray-600 hover:bg-gray-100"
      >
        <component :is="type?.({ editor }).icon" class=":uno: size-5" />
        <span>{{ type?.({ editor }).title }}</span>
        <MdiMenuDown />
      </button>
      <template #popper>
        <div
          class=":uno: relative max-h-96 w-56 overflow-hidden overflow-y-auto rounded-md bg-white p-1 drop-shadow"
        >
          <KeepAlive>
            <LinkViewMenu v-bind="props"></LinkViewMenu>
          </KeepAlive>
        </div>
      </template>
    </VDropdown>
  </template>
</template>
