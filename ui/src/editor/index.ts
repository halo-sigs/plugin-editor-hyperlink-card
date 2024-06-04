import {
  type Editor,
  EditorState,
  isActive,
  mergeAttributes,
  Node,
  ExtensionLink,
  getMarkAttributes,
  getNodeAttributes,
  ExtensionText,
} from "@halo-dev/richtext-editor";
import { markRaw, type Component } from "vue";
import PreviewLinkIcon from "~icons/fluent/preview-link-24-filled";
import MdiLinkVariant from "~icons/mdi/link-variant";
import LinkViewBubbleMenuItem from "@/components/LinkViewBubbleMenuItem.vue";
import TextExtensionMenuItem from "@/components/TextExtensionMenuItem.vue";
import { splitLink } from "./utils";

export interface LinkViewType {
  key: string;
  title: string;
  icon: Component;
  action: ({ editor }: { editor: Editor }) => void;
}

const HyperlinkCardExtension = Node.create({
  name: "linkView",

  atom: true,

  group: "block",

  onBeforeCreate() {
    const itemKey = "export-text-link-view";
    this.editor.extensionManager.extensions.forEach((extension) => {
      if (extension.name == "text") {
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

  addAttributes() {
    return {
      target: {
        default: "_blank",
        parseHTML: (element: any) => {
          return element.getAttribute("target");
        },
      },
      href: {
        default: null,
        parseHTML: (element: any) => {
          return element.getAttribute("href");
        },
      },
      type: {
        default: linkViewTypes[1].key,
        parseHTML: (element: any) => {
          return element.getAttribute("type");
        },
      },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getBubbleMenu() {
        return {
          pluginKey: "linkViewBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, HyperlinkCardExtension.name);
          },
          defaultAnimation: false,
          items: [
            {
              priority: 10,
              component: markRaw(LinkViewBubbleMenuItem),
              props: {
                type: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(
                    editor.state,
                    HyperlinkCardExtension.name
                  );
                  return (
                    linkViewTypes.find((type) => type.key == attr.type) ||
                    linkViewTypes[1]
                  );
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
    return [{ tag: "link-view" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "link-view",
      mergeAttributes(HTMLAttributes),
      [
        "a",
        { href: HTMLAttributes.href, target: HTMLAttributes.target },
        HTMLAttributes.href,
      ],
    ];
  },
});

export const linkViewTypes: LinkViewType[] = [
  {
    key: "link",
    title: "链接视图",
    icon: markRaw(MdiLinkVariant),
    action: ({ editor }) => {
      if (!isActive(editor.state, HyperlinkCardExtension.name)) {
        return;
      }
      const linkViewAttr = getNodeAttributes(
        editor.state,
        HyperlinkCardExtension.name
      );
      if (!linkViewAttr || !linkViewAttr.href) {
        return;
      }
      editor.commands.insertContent({
        // TODO: Use ExtensionParagraph to report an error Cannot read properties of undefined (reading 'name')
        type: "paragraph",
        content: [
          {
            type: ExtensionText.name,
            text: linkViewAttr.href,
            marks: [
              {
                type: ExtensionLink.name,
                attrs: {
                  href: linkViewAttr.href,
                },
              },
            ],
          },
        ],
      });
    },
  },
  {
    // TODO: convert to in line elements
    key: "title",
    title: "标题视图",
    icon: markRaw(MdiLinkVariant),
    action: ({ editor }) => {
      if (!isActive(editor.state, ExtensionLink.name)) {
        return;
      }
      editor
        .chain()
        .extendMarkRange(ExtensionLink.name)
        .command(({ tr }) => {
          return splitLink(tr);
        })
        .command(({ tr, state }) => {
          const linkAttr = getMarkAttributes(state, ExtensionLink.name);
          if (!linkAttr || !linkAttr.href) {
            return false;
          }
          tr.replaceSelectionWith(
            state.schema.nodes[HyperlinkCardExtension.name].create({
              href: linkAttr.href,
              type: "title-view",
            })
          );
          return true;
        })
        .focus()
        .run();
    },
  },
  {
    key: "card",
    title: "卡片视图",
    icon: markRaw(PreviewLinkIcon),
    action: ({ editor }) => {
      if (!isActive(editor.state, ExtensionLink.name)) {
        return;
      }
      editor
        .chain()
        .extendMarkRange(ExtensionLink.name)
        .command(({ tr }) => {
          return splitLink(tr);
        })
        .command(({ tr, state }) => {
          const linkAttr = getMarkAttributes(state, ExtensionLink.name);
          if (!linkAttr || !linkAttr.href) {
            return false;
          }
          tr.replaceSelectionWith(
            state.schema.nodes[HyperlinkCardExtension.name].create({
              href: linkAttr.href,
              type: "card",
            })
          );
          return true;
        })
        .focus()
        .run();
    },
  },
];

export default HyperlinkCardExtension;
