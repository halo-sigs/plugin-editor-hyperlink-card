import HyperlinkView from '@/components/HyperlinkView.vue';
import LinkViewBubbleMenuItem from '@/components/LinkViewBubbleMenuItem.vue';
import {
  EditorState,
  ExtensionOptions,
  Node,
  NodeBubbleMenuType,
  VueNodeViewRenderer,
  getNodeAttributes,
  isActive,
  mergeAttributes,
  type Editor,
} from '@halo-dev/richtext-editor';
import { markRaw } from 'vue';
import linkViewTypes from './link-view-type';
import MdiShare from '~icons/mdi/share';
import HyperlinkBubbleButton from '@/components/HyperlinkBubbleButton.vue';
import HyperlinkPropsBubbleButton from '@/components/HyperlinkPropsBubbleButton.vue';

const HyperlinkCardExtension = Node.create<ExtensionOptions>({
  name: 'hyperlinkCard',

  atom: true,

  group: 'block',

  addAttributes() {
    return {
      target: {
        default: '_blank',
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('target');
        },
      },
      href: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('href');
        },
      },
      theme: {
        default: linkViewTypes[1].key,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('theme');
        },
      },
      style: {
        default: 'margin-top: 0.75em; margin-bottom: 0;',
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('style');
        },
      },
      'custom-title': {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('custom-title');
        },
      },
      'custom-description': {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('custom-description');
        },
      },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getBubbleMenu(): NodeBubbleMenuType {
        return {
          pluginKey: 'linkViewBubbleMenu',
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, HyperlinkCardExtension.name);
          },
          items: [
            {
              priority: 10,
              component: markRaw(LinkViewBubbleMenuItem),
              props: {
                type: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(editor.state, HyperlinkCardExtension.name);
                  return linkViewTypes.find((type) => type.key == attr.theme) || linkViewTypes[1];
                },
              },
            },
            {
              priority: 20,
              component: markRaw(HyperlinkBubbleButton),
              props: {
                name: HyperlinkCardExtension.name,
              },
            },
            {
              priority: 25,
              component: markRaw(HyperlinkPropsBubbleButton),
              props: {
                name: HyperlinkCardExtension.name,
              },
            },
            {
              priority: 30,
              props: {
                isActive: () => false,
                icon: markRaw(MdiShare),
                title: '打开链接',
                action: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(editor.state, HyperlinkCardExtension.name);
                  if (attr?.href) {
                    window.open(attr?.href, '_blank');
                  }
                },
              },
            },
          ],
        };
      },
      // TODO: The drag-and-drop function of this component does not respond.
      // Maybe it's because of the Web component?
      getDraggable() {
        return true;
      },
    };
  },

  parseHTML() {
    return [{ tag: 'hyperlink-card' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'hyperlink-card',
      mergeAttributes(HTMLAttributes),
      ['a', { href: HTMLAttributes.href, target: HTMLAttributes.target }, HTMLAttributes.href],
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(HyperlinkView);
  },
});

export default HyperlinkCardExtension;
