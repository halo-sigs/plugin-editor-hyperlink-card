<script lang="ts" setup>
import { computed, type Component } from 'vue';
import { vTooltip, Dropdown as VDropdown } from 'floating-vue';
import MdiLinkVariant from '~icons/mdi/link-variant';
import type { Editor } from '@halo-dev/richtext-editor';

const props = defineProps<{
  editor: Editor;
  name: string;
  isActive: ({ editor }: { editor: Editor }) => boolean;
  visible?: ({ editor }: { editor: Editor }) => boolean;
  icon?: Component;
  title?: string;
  action?: ({ editor }: { editor: Editor }) => void;
}>();

const href = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.href;
  },
  set(value) {
    const { selection } = props.editor.state;
    if (!selection) {
      return;
    }
    const pos = selection.$anchor.pos;
    props.editor
      .chain()
      .updateAttributes(props.name, {
        href: value,
        target: target.value ? '_blank' : '_self',
      })
      .setNodeSelection(pos)
      .run();
  },
});

const target = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.target === '_blank';
  },
  set(value) {
    const { selection } = props.editor.state;
    if (!selection) {
      return;
    }
    const pos = selection.$anchor.pos;
    props.editor
      .chain()
      .updateAttributes(props.name, {
        href: href.value,
        target: value ? '_blank' : '_self',
      })
      .setNodeSelection(pos)
      .run();
  },
});
</script>

<template>
  <VDropdown class="hyperlink-inline-flex" :triggers="['click']" :distance="10">
    <button
      v-tooltip="'编辑链接'"
      class="hyperlink-rounded-md hyperlink-p-2 hyperlink-text-lg hyperlink-text-gray-600 hover:hyperlink-bg-gray-100"
    >
      <MdiLinkVariant />
    </button>

    <template #popper>
      <div
        class="hyperlink-relative hyperlink-max-h-72 hyperlink-w-96 hyperlink-overflow-hidden hyperlink-overflow-y-auto hyperlink-rounded-md hyperlink-bg-white hyperlink-p-1 hyperlink-drop-shadow"
      >
        <input
          v-model.lazy="href"
          placeholder="链接地址"
          class="hyperlink-block hyperlink-w-full hyperlink-rounded-md hyperlink-border hyperlink-border-gray-300 hyperlink-bg-gray-50 hyperlink-px-2 hyperlink-py-1.5 hyperlink-text-sm hyperlink-text-gray-900 hover:hyperlink-bg-gray-100 focus:hyperlink-border-blue-500 focus:hyperlink-ring-blue-500"
        />
        <label class="hyperlink-mt-2 hyperlink-inline-flex hyperlink-items-center">
          <input
            v-model="target"
            type="checkbox"
            class="hyperlink-form-checkbox hyperlink-rounded hyperlink-border-gray-300 hyperlink-text-blue-600 focus:hyperlink-ring-blue-500"
          />
          <span class="hyperlink-ml-2 hyperlink-text-sm hyperlink-text-gray-500"
            >在新窗口中打开</span
          >
        </label>
      </div>
    </template>
  </VDropdown>
</template>
