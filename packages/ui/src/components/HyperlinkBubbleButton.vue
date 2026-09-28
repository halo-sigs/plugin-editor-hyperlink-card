<script lang="ts" setup>
import { refreshCard, selectedCard } from "@/editor/link-data";
import { trackCard } from "@/editor/track-card";
import { VButton, VDropdown } from "@halo-dev/components";
import {
  BubbleButton,
  closeHistory,
  Input,
  type BubbleItemComponentProps,
} from "@halo-dev/richtext-editor";
import { computed, onBeforeUnmount, ref } from "vue";
import MingcuteLinkLine from "~icons/mingcute/link-line";

const props = defineProps<BubbleItemComponentProps & { name: string }>();
const draftHref = ref("");
let editing: ReturnType<typeof trackCard> | undefined;
function stopEditing() {
  editing?.stop();
  editing = undefined;
}
onBeforeUnmount(stopEditing);

function startEditing() {
  stopEditing();
  const node = selectedCard(props.editor, props.name);
  if (node) editing = trackCard(props.editor, node);
  draftHref.value = node?.attrs.href || "";
}

function applyHref() {
  const href = draftHref.value.trim();
  const editingNode = editing?.node;
  const position = editing?.position;
  if (!href || !editingNode || position === undefined || href === editingNode.attrs.href) return;
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
  const node = editing?.node;
  if (node) void refreshCard(props.editor, node, true);
}

const target = computed({
  get() {
    return props.editor.getAttributes(props.name)?.target === "_blank";
  },
  set(value) {
    if (!editing?.node || editing.position === undefined) return;
    const { node, position } = editing;
    props.editor.commands.command(({ tr }) => {
      tr.setNodeMarkup(position!, undefined, {
        ...node!.attrs,
        target: value ? "_blank" : "_self",
      });
      return true;
    });
  },
});
</script>

<template>
  <VDropdown
    class=":uno: inline-flex"
    :triggers="['click']"
    :distance="10"
    @show="startEditing"
    @hide="stopEditing"
  >
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
