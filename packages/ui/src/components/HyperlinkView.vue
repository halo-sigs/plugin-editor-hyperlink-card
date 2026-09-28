<script lang="ts" setup>
import { fetchingCards } from "@/editor/link-data";
import "@halo-dev/hyperlink-card";
import { NodeViewWrapper, nodeViewProps } from "@halo-dev/richtext-editor";
import { ref, watch } from "vue";
import MingcuteLoadingLine from "~icons/mingcute/loading-line";

const props = defineProps(nodeViewProps);

const cardRef = ref();

watch(
  () => props.node.attrs.href,
  (value) => {
    if (value && cardRef.value) {
      cardRef.value.href = value;
    }
  }
);
</script>

<template>
  <node-view-wrapper
    as="div"
    class=":uno: mb-0 mt-[0.75em] first:mt-0"
    :class="{ ':uno: rounded-xl ring-1': selected }"
  >
    <span
      v-if="fetchingCards.has(node)"
      role="status"
      contenteditable="false"
      class=":uno: inline-flex items-center gap-1 text-xs text-gray-500"
    >
      <MingcuteLoadingLine class=":uno: animate-spin" />
      正在获取链接信息…
    </span>
    <hyperlink-card
      ref="cardRef"
      data-mode="snapshot"
      class=":uno: pointer-events-none select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
      :custom-title="node.attrs?.['custom-title']"
      :custom-description="node.attrs?.['custom-description']"
      :custom-image="node.attrs?.['custom-image']"
      :custom-icon="node.attrs?.['custom-icon']"
    ></hyperlink-card>
  </node-view-wrapper>
</template>
