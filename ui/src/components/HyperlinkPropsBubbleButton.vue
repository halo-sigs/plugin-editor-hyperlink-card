<script lang="ts" setup>
import { computed, type Component } from 'vue';
import { vTooltip, Dropdown as VDropdown } from 'floating-vue';
import type { Editor } from '@halo-dev/richtext-editor';
import MdiTextBoxEditOutline from '~icons/mdi/text-box-edit-outline';
import { HyperlinkInlineCardExtension } from '@/editor';

const props = defineProps<{
  editor: Editor;
  name: string;
  isActive: ({ editor }: { editor: Editor }) => boolean;
  visible?: ({ editor }: { editor: Editor }) => boolean;
  icon?: Component;
  title?: string;
  action?: ({ editor }: { editor: Editor }) => void;
}>();

const customTitle = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.['custom-title'];
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
        'custom-title': value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const customDescription = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.['custom-description'];
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
        'custom-description': value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const isInline = computed(() => {
  return props.name === HyperlinkInlineCardExtension.name;
});
</script>

<template>
  <VDropdown class=":uno: inline-flex" :triggers="['click']" :distance="10">
    <button
      v-tooltip="'编辑属性'"
      class=":uno: rounded-md p-2 text-lg text-gray-600 hover:bg-gray-100"
    >
      <MdiTextBoxEditOutline />
    </button>

    <template #popper>
      <div
        class=":uno: relative max-h-72 w-96 overflow-hidden overflow-y-auto rounded-md bg-white p-1 drop-shadow flex flex-col gap-2"
      >
        <div>
          <label for="custom-title" class=":uno: text-sm text-gray-500">自定义标题</label>
          <input
            id="custom-title"
            v-model.lazy="customTitle"
            class=":uno: block w-full mt-1.5 border border-gray-300 rounded-md bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 hover:bg-gray-100 focus:ring-blue-500"
          />
        </div>
        <div v-if="!isInline">
          <label for="custom-description" class=":uno: text-sm text-gray-500"> 自定义描述 </label>
          <input
            id="custom-description"
            v-model.lazy="customDescription"
            class=":uno: block w-full mt-1.5 border border-gray-300 rounded-md bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 hover:bg-gray-100 focus:ring-blue-500"
          />
        </div>
      </div>
    </template>
  </VDropdown>
</template>
