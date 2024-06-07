<script lang="ts" setup>
import type { HyperlinkCard } from '@halo-dev/hyperlink-card';
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor';
import { ref, watch } from 'vue';

const props = defineProps(nodeViewProps);

const cardRef = ref<InstanceType<typeof HyperlinkCard> | null>();

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
    as="div"
    class="hyperlink-mb-0 hyperlink-mt-[0.75em] first:hyperlink-mt-0"
    :class="{ 'hyperlink-rounded-xl hyperlink-ring-1': selected }"
  >
    <hyperlink-card
      ref="cardRef"
      class="hyperlink-pointer-events-none hyperlink-select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
    ></hyperlink-card>
  </node-view-wrapper>
</template>
