<script lang="ts" setup>
import { computed } from 'vue';
import { VDropdown } from '@halo-dev/components';
import { BubbleButton, BubbleItemComponentProps } from '@halo-dev/richtext-editor';
import MingcuteEdit4Line from '~icons/mingcute/edit-4-line';
import { HyperlinkInlineCardExtension } from '@/editor';

const props = defineProps<BubbleItemComponentProps & { name: string }>();

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
    <BubbleButton title="编辑属性">
      <template #icon>
        <MingcuteEdit4Line class=":uno: size-5" />
      </template>
    </BubbleButton>

    <template #popper>
      <div
        class=":uno: relative max-h-72 w-96 overflow-hidden overflow-y-auto bg-white flex flex-col gap-2"
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
