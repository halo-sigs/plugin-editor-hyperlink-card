<script lang="ts" setup>
import { HyperlinkInlineCardExtension } from "@/editor";
import { axiosInstance } from "@halo-dev/api-client";
import { VButton, VDropdown } from "@halo-dev/components";
import { BubbleButton, type BubbleItemComponentProps, Input } from "@halo-dev/richtext-editor";
import { computed, ref } from "vue";
import MingcuteEdit4Line from "~icons/mingcute/edit-4-line";
import RiGlobalLine from "~icons/ri/global-line";

const props = defineProps<BubbleItemComponentProps & { name: string }>();

const customTitle = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.["custom-title"];
  },
  set(value) {
    const { selection } = props.editor.state;
    if (!selection) {
      return;
    }
    const pos = selection.$anchor.pos;
    props.editor
      .chain()
      .updateAttributes(props.name, {
        "custom-title": value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const customDescription = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.["custom-description"];
  },
  set(value) {
    const { selection } = props.editor.state;
    if (!selection) {
      return;
    }
    const pos = selection.$anchor.pos;
    props.editor
      .chain()
      .updateAttributes(props.name, {
        "custom-description": value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const customImage = computed({
  get() {
    const attrs = props.editor.getAttributes(props.name);
    return attrs?.["custom-image"];
  },
  set(value) {
    const { selection } = props.editor.state;
    if (!selection) {
      return;
    }
    const pos = selection.$anchor.pos;
    props.editor
      .chain()
      .updateAttributes(props.name, {
        "custom-image": value,
      })
      .setNodeSelection(pos)
      .run();
  },
});

const isInline = computed(() => {
  return props.name === HyperlinkInlineCardExtension.name;
});

const isFetching = ref(false);

async function handleGetSiteData() {
  isFetching.value = true;
  try {
    const { data } = await axiosInstance.get(`/apis/api.hyperlink.halo.run/v1alpha1/link-detail`, {
      params: {
        url: props.editor.getAttributes(props.name)?.href,
      },
    });
    customTitle.value = data.title;
    customDescription.value = data.description;
    customImage.value = data.image || data.icon;
  } finally {
    isFetching.value = false;
  }
}
</script>

<template>
  <!-- @vue-ignore -->
  <VDropdown :dispose-timeout="null" class=":uno: inline-flex" :triggers="['click']" :distance="10">
    <BubbleButton title="编辑属性">
      <template #icon>
        <MingcuteEdit4Line />
      </template>
    </BubbleButton>

    <template #popper>
      <div class=":uno: flex w-80 flex-col gap-3">
        <div>
          <VButton
            v-tooltip="'先从网站获取信息，再进行修改'"
            :loading="isFetching"
            size="sm"
            @click="handleGetSiteData"
          >
            <template #icon>
              <RiGlobalLine />
            </template>
            获取网站信息
          </VButton>
        </div>
        <Input v-model="customTitle" auto-focus label="自定义标题" />
        <Input v-if="!isInline" v-model="customDescription" label="自定义描述" />
        <FormKit
          v-if="isInline || props.editor.getAttributes(props.name)?.['theme'] === 'small'"
          v-model="customImage"
          :classes="{
            outer: ':uno: !pt-0',
          }"
          format="dataurl"
          value-only
          type="iconify"
          help="自定义图标"
        ></FormKit>
        <FormKit
          v-else
          v-model="customImage"
          :classes="{
            outer: ':uno: !pt-0',
          }"
          type="attachment"
          help="自定义图片"
        ></FormKit>
      </div>
    </template>
  </VDropdown>
</template>
