<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor';

defineProps(nodeViewProps);
</script>

<template>
  <node-view-wrapper
    as="div"
    class="hyperlink-mb-0 hyperlink-mt-[0.75em] first:hyperlink-mt-0"
    :class="{ 'hyperlink-rounded-xl hyperlink-ring-1': selected }"
  >
    <hyperlink-card
      class="hyperlink-pointer-events-none hyperlink-select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
    ></hyperlink-card>
  </node-view-wrapper>
</template>
