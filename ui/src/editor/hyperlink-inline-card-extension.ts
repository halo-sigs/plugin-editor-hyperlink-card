import HyperlinkBubbleButton from "@/components/HyperlinkBubbleButton.vue";
import HyperlinkInlineView from "@/components/HyperlinkInlineView.vue";
import HyperlinkPropsBubbleButton from "@/components/HyperlinkPropsBubbleButton.vue";
import LinkViewBubbleMenuItem from "@/components/LinkViewBubbleMenuItem.vue";
import {
  EditorState,
  getNodeAttributes,
  isActive,
  mergeAttributes,
  Node,
  VueNodeViewRenderer,
  type Editor,
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import MingcuteShare3Line from "~icons/mingcute/share-3-line";
import linkViewTypes from "./link-view-type";

const HyperlinkInlineCardExtension = Node.create({
  name: "hyperlinkInlineCard",

  atom: true,

  inline: true,

  group: "inline",

  addAttributes() {
    return {
      target: {
        default: "_blank",
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute("target");
        },
      },
      href: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute("href");
        },
      },
      theme: {
        default: linkViewTypes[1].key,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute("theme");
        },
      },
      "custom-title": {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute("custom-title");
        },
      },
      "custom-description": {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute("custom-description");
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
            {
              priority: 20,
              component: markRaw(HyperlinkBubbleButton),
              props: {
                name: HyperlinkInlineCardExtension.name,
              },
            },
            {
              priority: 25,
              component: markRaw(HyperlinkPropsBubbleButton),
              props: {
                name: HyperlinkInlineCardExtension.name,
              },
            },
            {
              priority: 30,
              props: {
                isActive: () => false,
                icon: markRaw(MingcuteShare3Line),
                title: "打开链接",
                action: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(editor.state, HyperlinkInlineCardExtension.name);
                  if (attr?.href) {
                    window.open(attr?.href, "_blank");
                  }
                },
              },
            },
          ],
        };
      },
    };
  },

  parseHTML() {
    return [{ tag: "hyperlink-inline-card" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "hyperlink-inline-card",
      mergeAttributes(HTMLAttributes),
      ["a", { href: HTMLAttributes.href, target: HTMLAttributes.target }, HTMLAttributes.href],
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(HyperlinkInlineView);
  },
});

export default HyperlinkInlineCardExtension;
