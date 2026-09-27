<script setup lang="ts">
import { canFetchLinkData, refreshCard, selectedCard } from "@/editor/link-data";
import { BubbleButton, type BubbleItemComponentProps } from "@halo-dev/richtext-editor";
import { ref } from "vue";
import MingcuteRefresh2Line from "~icons/mingcute/refresh-2-line";

const props = defineProps<BubbleItemComponentProps & { name: string }>();
const isFetching = ref(false);

async function refresh() {
  if (isFetching.value || !canFetchLinkData()) return;
  const target = selectedCard(props.editor, props.name);
  if (!target) return;
  isFetching.value = true;
  try {
    await refreshCard(props.editor, target);
  } finally {
    isFetching.value = false;
  }
}
</script>

<template>
  <BubbleButton
    class=":uno: disabled:cursor-not-allowed disabled:opacity-50"
    :disabled="isFetching || !canFetchLinkData()"
    :title="
      !canFetchLinkData()
        ? '需要获取链接卡片信息权限，请联系管理员'
        : isFetching
          ? '正在获取链接信息'
          : '更新链接信息（替换标题、描述和图片，可撤销）'
    "
    @click="refresh"
  >
    <template #icon>
      <MingcuteRefresh2Line :class="{ ':uno: animate-spin': isFetching }" />
    </template>
  </BubbleButton>
</template>
