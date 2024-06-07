<script lang="ts" setup>
import type { HyperlinkInlineCard } from '@halo-dev/hyperlink-card';
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor';
import { ref, watch } from 'vue';

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
    class="hyperlink-inline-block hyperlink-h-full"
    :class="{ 'hyperlink-ring-1': selected }"
  >
    <hyperlink-inline-card
      ref="cardRef"
      class="hyperlink-pointer-events-none hyperlink-select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
    ></hyperlink-inline-card>
  </node-view-wrapper>
</template>
