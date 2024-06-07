<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from '@halo-dev/richtext-editor';

defineProps(nodeViewProps);
</script>

<template>
  <node-view-wrapper
    as="span"
    class="hyperlink-inline-block hyperlink-h-full"
    :class="{ 'hyperlink-ring-1': selected }"
  >
    <hyperlink-inline-card
      class="hyperlink-pointer-events-none hyperlink-select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
    ></hyperlink-inline-card>
  </node-view-wrapper>
</template>
