<script lang="ts" setup>
import { refreshCard, selectedCard } from "@/editor/link-data";
import { VButton, VDropdown } from "@halo-dev/components";
import {
  BubbleButton,
  closeHistory,
  Input,
  type BubbleItemComponentProps,
} from "@halo-dev/richtext-editor";
import { computed, ref } from "vue";
import MingcuteLinkLine from "~icons/mingcute/link-line";

const props = defineProps<BubbleItemComponentProps & { name: string }>();
const draftHref = ref("");
let editingNode: ReturnType<typeof selectedCard>;

function startEditing() {
  editingNode = selectedCard(props.editor, props.name);
  draftHref.value = editingNode?.attrs.href || "";
}

function applyHref() {
  const href = draftHref.value.trim();
  if (!href || !editingNode || href === editingNode.attrs.href) return;
  let position: number | undefined;
  props.editor.state.doc.descendants((node, pos) => {
    if (node === editingNode) position = pos;
  });
  if (position === undefined) return;
  props.editor.commands.command(({ tr }) => {
    tr.setNodeMarkup(position!, undefined, {
      ...editingNode!.attrs,
      href,
      "data-mode": "snapshot",
      "custom-title": href,
      "custom-description": null,
      "custom-image": null,
      "custom-icon": null,
    });
    closeHistory(tr as unknown as Parameters<typeof closeHistory>[0]);
    return true;
  });
  const node = props.editor.state.doc.nodeAt(position);
  editingNode = node || undefined;
  if (node) {
    void refreshCard(props.editor, node, true).then((updated) => {
      if (editingNode === node && updated) editingNode = updated;
    });
  }
}

const target = computed({
  get() {
    return props.editor.getAttributes(props.name)?.target === "_blank";
  },
  set(value) {
    props.editor.commands.updateAttributes(props.name, { target: value ? "_blank" : "_self" });
    editingNode = selectedCard(props.editor, props.name);
  },
});
</script>

<template>
  <VDropdown class=":uno: inline-flex" :triggers="['click']" :distance="10" @show="startEditing">
    <BubbleButton title="编辑链接">
      <template #icon><MingcuteLinkLine /></template>
    </BubbleButton>
    <template #popper>
      <form class=":uno: w-80" @submit.prevent="applyHref">
        <Input v-model="draftHref" auto-focus label="链接地址" />
        <label class=":uno: mt-2 inline-flex items-center">
          <input v-model="target" type="checkbox" />
          <span class=":uno: ml-2 text-sm text-gray-500">在新窗口中打开</span>
        </label>
        <p class=":uno: my-2 text-xs text-gray-500">更换链接会重新获取信息并替换原内容，可撤销。</p>
        <VButton size="sm" :disabled="!draftHref.trim()" @click="applyHref">应用链接</VButton>
      </form>
    </template>
  </VDropdown>
</template>
