<script lang="ts" setup>
import type { LinkViewType } from "@/editor";
import type { Editor } from "@halo-dev/richtext-editor";
import { Dropdown as VDropdown } from "floating-vue";
import type { Component } from "vue";
import LinkViewMenu from "@/components/LinkViewMenu.vue";
import MdiMenuDown from "~icons/mdi/menu-down";

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
    <VDropdown
      class="inline-flex"
      :triggers="['click']"
      :popper-triggers="['click']"
    >
      <button
        :class="{ 'bg-gray-200 !text-black': isActive({ editor }) }"
        class="inline-flex w-30 items-center gap-x-1 rounded-md p-1 text-base text-gray-600 hover:bg-gray-100"
      >
        <component :is="type?.({ editor }).icon" class="h-5 w-5" />
        <span>{{ type?.({ editor }).title }}</span>
        <MdiMenuDown />
      </button>
      <template #popper>
        <div
          class="relative max-h-72 w-48 overflow-hidden overflow-y-auto rounded-md bg-white p-1 drop-shadow"
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