import TextExtensionMenuItem from '@/components/TextExtensionMenuItem.vue';
import { Editor, Extension, ExtensionLink, isActive } from '@halo-dev/richtext-editor';
import { markRaw } from 'vue';
import linkViewTypes from './link-view-type';

const TextBubbleExtension = Extension.create({
  name: 'textHyperlinkCardExtension',

  onCreate() {
    const itemKey = 'export-text-link-view';
    this.editor.extensionManager.extensions.forEach((extension) => {
      if (extension.name == 'text') {
        const bubbleMenu = extension.options?.getBubbleMenu?.({
          editor: this.editor,
        });
        if (!bubbleMenu?.items) {
          return;
        }
        const items = bubbleMenu.items;
        if (!items || items.length == 0) {
          return;
        }

        //@ts-ignore
        const linkViewItem = items.find((item) => item.key == itemKey);
        if (linkViewItem) {
          return;
        }

        items.push({
          priority: 115,
          key: itemKey,
          component: markRaw(TextExtensionMenuItem),
          props: {
            type: () => {
              return linkViewTypes[0];
            },
            visible: ({ editor }: { editor: Editor }) => {
              return isActive(editor.state, ExtensionLink.name);
            },
          },
        });
        extension.options.getBubbleMenu = () => {
          return {
            ...bubbleMenu,
            items,
          };
        };
      }
    });
  },
});

export default TextBubbleExtension;
