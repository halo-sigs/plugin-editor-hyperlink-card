import LinkViewBubbleMenuItem from '@/components/LinkViewBubbleMenuItem.vue';
import {
  EditorState,
  Node,
  NodeSelection,
  PMNode,
  Plugin,
  PluginKey,
  getNodeAttributes,
  isActive,
  mergeAttributes,
  type Editor,
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import linkViewTypes from "./link-view-type";
import { resolve } from "./utils";

const HyperlinkInlineCardExtension = Node.create({
  name: 'hyperlinkInlineCard',

  atom: true,

  inline: true,

  group: 'inline',

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
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getBubbleMenu() {
        return {
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, HyperlinkInlineCardExtension.name);
          },
          defaultAnimation: false,
          items: [
            {
              priority: 10,
              component: markRaw(LinkViewBubbleMenuItem),
              props: {
                type: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(editor.state, HyperlinkInlineCardExtension.name);
                  return linkViewTypes.find((type) => type.key == attr.theme) || linkViewTypes[1];
                },
              },
            },
          ],
        };
      },
    };
  },
  parseHTML() {
    return [{ tag: 'hyperlink-inline-card' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'hyperlink-inline-card',
      mergeAttributes(HTMLAttributes),
      ['a', { href: HTMLAttributes.href, target: HTMLAttributes.target }, HTMLAttributes.href],
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("hyperlinkInlineCardKey"),
        props: {
          handleDOMEvents: {
            mouseover: (view, event) => {
              const coords = {
                left: event.clientX,
                top: event.clientY,
              };
              // 从 event 中判断当前移入的元素
              const pos = view.posAtCoords(coords);
              if (!pos) {
                return false;
              }
              const $pos = resolve(view.state.doc, pos.pos);
              if ($pos.length === 0) {
                return false;
              }
              const currentNodePos = $pos[$pos.length - 1];
              const parentNode = currentNodePos.node;
              if (
                parentNode.content.childCount === 0 ||
                parentNode.content.childCount <= currentNodePos.index
              ) {
                return false;
              }
              const node = parentNode.child(currentNodePos.index);
              const state = view.state;
              const tr = state.tr;
              if (predicate(node)) {
                tr.setSelection(new NodeSelection(state.doc.resolve(pos.pos)));
                view.dispatch(tr);
                return false;
              }
            },
          },
        },
      }),
    ];
  },
});

const predicate = (node: PMNode) => {
  return node.type.name === HyperlinkInlineCardExtension.name;
};

export default HyperlinkInlineCardExtension;
