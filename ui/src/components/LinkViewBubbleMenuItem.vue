<script lang="ts" setup>
import LinkViewMenu from "@/components/LinkViewMenu.vue";
import type { LinkViewType } from "@/editor/link-view-type";
import { VDropdown } from "@halo-dev/components";
import {
  BubbleButton,
  type BubbleItemComponentProps,
  type Editor,
} from "@halo-dev/richtext-editor";

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
    <VDropdown class=":uno: inline-flex" :triggers="['click']" :popper-triggers="['click']">
      <BubbleButton
        :text="type?.({ editor }).title"
        show-more-indicator
        :is-active="isActive({ editor })"
      >
        <template #icon>
          <component :is="type?.({ editor }).icon" />
        </template>
      </BubbleButton>
      <template #popper>
        <div class=":uno: relative max-h-96 w-56 overflow-hidden overflow-y-auto">
          <KeepAlive>
            <LinkViewMenu v-bind="props"></LinkViewMenu>
          </KeepAlive>
        </div>
      </template>
    </VDropdown>
  </template>
</template>
