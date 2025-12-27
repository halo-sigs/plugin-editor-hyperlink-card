<script lang="ts" setup>
import { computed } from "vue";
import { VDropdown } from "@halo-dev/components";
import { BubbleButton, BubbleItemComponentProps, Input } from "@halo-dev/richtext-editor";
import MingcuteEdit4Line from "~icons/mingcute/edit-4-line";
import { HyperlinkInlineCardExtension } from "@/editor";

const props = defineProps<BubbleItemComponentProps & { name: string }>();

const customTitle = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.["custom-title"];
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
        "custom-title": value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const customDescription = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.["custom-description"];
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
        "custom-description": value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const customImage = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.["custom-image"];
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
        "custom-image": value,
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
  <!-- @vue-ignore -->
  <VDropdown :dispose-timeout="null" class=":uno: inline-flex" :triggers="['click']" :distance="10">
    <BubbleButton title="编辑属性">
      <template #icon>
        <MingcuteEdit4Line />
      </template>
    </BubbleButton>

    <template #popper>
      <div class=":uno: flex w-80 flex-col gap-3">
        <Input v-model="customTitle" auto-focus label="自定义标题" />
        <Input v-if="!isInline" v-model="customDescription" label="自定义描述" />
        <FormKit
          v-if="isInline || props.editor.getAttributes(props.name)?.['theme'] === 'small'"
          v-model="customImage"
          :classes="{
            outer: ':uno: !pt-0',
          }"
          format="dataurl"
          value-only
          type="iconify"
          help="自定义图标"
        ></FormKit>
        <FormKit
          v-else
          v-model="customImage"
          :classes="{
            outer: ':uno: !pt-0',
          }"
          type="attachment"
          help="自定义图片"
        ></FormKit>
      </div>
    </template>
  </VDropdown>
</template>
