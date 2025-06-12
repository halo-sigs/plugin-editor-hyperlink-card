<script lang="ts" setup>
import type { HyperlinkInlineCard } from '@halo-dev/hyperlink-card';
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor';
import { ref, watch } from 'vue';
import '@halo-dev/hyperlink-card';

const props = defineProps(nodeViewProps);

const cardRef = ref<InstanceType<typeof HyperlinkInlineCard> | null>();

watch(
  () => props.node.attrs.href,
  (value) => {
    if (value && cardRef.value) {
      cardRef.value.href = value;
      cardRef.value.fetchSiteData();
    }
  }
);
</script>

<template>
  <node-view-wrapper
    as="span"
    class=":uno: inline-block h-full"
    :class="{ ':uno: ring-1': selected }"
  >
    <hyperlink-inline-card
      ref="cardRef"
      class=":uno: pointer-events-none select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
    ></hyperlink-inline-card>
  </node-view-wrapper>
</template>
