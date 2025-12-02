<script lang="ts" setup>
import { computed, type Component } from 'vue';
import { vTooltip, VDropdown } from '@halo-dev/components';
import MingcuteLinkLine from '~icons/mingcute/link-line';
import { BlockActionButton, type Editor } from '@halo-dev/richtext-editor';

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
  <VDropdown class=":uno: inline-flex" :triggers="['click']" :distance="10">
    <BlockActionButton tooltip="编辑链接">
      <template #icon>
        <MingcuteLinkLine />
      </template>
    </BlockActionButton>

    <template #popper>
      <div class=":uno: relative max-h-72 w-96 overflow-hidden overflow-y-auto bg-white">
        <input
          v-model.lazy="href"
          placeholder="链接地址"
          class=":uno: block w-full border border-gray-300 rounded-md bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 hover:bg-gray-100 focus:ring-blue-500"
        />
        <label class=":uno: mt-2 inline-flex items-center">
          <input
            v-model="target"
            type="checkbox"
            class=":uno: form-checkbox border-gray-300 rounded text-blue-600 focus:ring-blue-500"
          />
          <span class=":uno: ml-2 text-sm text-gray-500">在新窗口中打开</span>
        </label>
      </div>
    </template>
  </VDropdown>
</template>
