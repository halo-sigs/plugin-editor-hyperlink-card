<script lang="ts" setup>
import "@halo-dev/hyperlink-card";
import { NodeViewWrapper, nodeViewProps } from "@halo-dev/richtext-editor";
import { ref, watch } from "vue";

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
    as="span"
    class=":uno: inline-block h-full"
    :class="{ ':uno: ring-1': selected }"
  >
    <hyperlink-inline-card
      ref="cardRef"
      class=":uno: pointer-events-none select-none"
      :href="node.attrs.href"
      :theme="node.attrs.theme"
      :custom-title="node.attrs?.['custom-title']"
      :custom-description="node.attrs?.['custom-description']"
      :custom-image="node.attrs?.['custom-image']"
    ></hyperlink-inline-card>
  </node-view-wrapper>
</template>
