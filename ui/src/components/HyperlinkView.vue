<script lang="ts" setup>
import type { HyperlinkCard } from '@halo-dev/hyperlink-card';
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor';
import { ref, watch } from 'vue';
import '@halo-dev/hyperlink-card';

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
    class=":uno: mb-0 mt-[0.75em] first:mt-0"
    :class="{ ':uno: rounded-xl ring-1': selected }"
  >
    <hyperlink-card
      ref="cardRef"
      class=":uno: pointer-events-none select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
      :custom-title="node.attrs?.['custom-title']"
      :custom-description="node.attrs?.['custom-description']"
    ></hyperlink-card>
  </node-view-wrapper>
</template>
