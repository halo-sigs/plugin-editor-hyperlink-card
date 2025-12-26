import {
  ExtensionLink,
  ExtensionText,
  getMarkAttributes,
  getNodeAttributes,
  isActive,
  type Editor,
} from "@halo-dev/richtext-editor";
import { markRaw, type Component } from "vue";
import MdiCardBulletedOutline from "~icons/mdi/card-bulleted-outline";
import MingcuteLayoutGridLine from "~icons/mingcute/layout-grid-line";
import MingcuteLinkLine from "~icons/mingcute/link-line";
import MingcuteTextLine from "~icons/mingcute/text-line";
import HyperlinkCardExtension from "./hyperlink-card-extension";
import HyperlinkInlineCardExtension from "./hyperlink-inline-card-extension";
import { splitLink } from "./utils";

export interface LinkViewType {
  key: string;
  title: string;
  icon: Component;
  action: ({ editor }: { editor: Editor }) => void;
}

const linkViewTypes: LinkViewType[] = [
  {
    key: "link",
    title: "普通链接",
    icon: markRaw(MingcuteLinkLine),
    action: ({ editor }) => {
      let linkViewAttr;
      if (isActive(editor.state, HyperlinkCardExtension.name)) {
        linkViewAttr = getNodeAttributes(editor.state, HyperlinkCardExtension.name);
      }

      if (isActive(editor.state, HyperlinkInlineCardExtension.name)) {
        linkViewAttr = getNodeAttributes(editor.state, HyperlinkInlineCardExtension.name);
      }

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
    key: "inline",
    title: "行内卡片",
    icon: markRaw(MingcuteTextLine),
    action: ({ editor }) => {
      if (isActive(editor.state, ExtensionLink.name)) {
        editor
          .chain()
          .extendMarkRange(ExtensionLink.name)
          .command(({ tr, state }) => {
            const linkAttr = getMarkAttributes(state, ExtensionLink.name);
            if (!linkAttr || !linkAttr.href) {
              return false;
            }
            tr.replaceSelectionWith(
              state.schema.nodes[HyperlinkInlineCardExtension.name].create({
                href: linkAttr.href,
                theme: "inline",
              })
            );
            return true;
          })
          .focus()
          .run();
        return;
      }
      if (isActive(editor.state, HyperlinkCardExtension.name)) {
        const linkViewAttr = getNodeAttributes(editor.state, HyperlinkCardExtension.name);
        editor
          .chain()
          .command(({ tr, state }) => {
            tr.replaceSelectionWith(
              state.schema.nodes[HyperlinkInlineCardExtension.name].create({
                href: linkViewAttr.href,
                theme: "inline",
                "custom-title": linkViewAttr?.["custom-title"],
                "custom-description": linkViewAttr?.["custom-description"],
              })
            );
            return true;
          })
          .run();
        return;
      }
    },
  },
  {
    key: "small",
    title: "链接卡片（小）",
    icon: markRaw(MdiCardBulletedOutline),
    action: ({ editor }) => {
      changeToHyperlinkCardExtension(editor, "small");
    },
  },
  {
    key: "regular",
    title: "链接卡片（正常）",
    icon: markRaw(MdiCardBulletedOutline),
    action: ({ editor }) => {
      changeToHyperlinkCardExtension(editor, "regular");
    },
  },
  {
    key: "grid",
    title: "链接卡片（格子）",
    icon: markRaw(MingcuteLayoutGridLine),
    action: ({ editor }) => {
      changeToHyperlinkCardExtension(editor, "grid");
    },
  },
];

const changeToHyperlinkCardExtension = (editor: Editor, theme: string) => {
  if (isActive(editor.state, ExtensionLink.name)) {
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
            theme: theme,
          })
        );
        return true;
      })
      .focus()
      .run();
    return;
  }
  if (isActive(editor.state, HyperlinkCardExtension.name)) {
    editor.commands.updateAttributes(HyperlinkCardExtension.name, {
      theme: theme,
    });
    return;
  }
  if (isActive(editor.state, HyperlinkInlineCardExtension.name)) {
    const linkViewAttr = getNodeAttributes(editor.state, HyperlinkInlineCardExtension.name);
    editor
      .chain()
      .command(({ tr, state }) => {
        tr.replaceSelectionWith(
          state.schema.nodes[HyperlinkCardExtension.name].create({
            href: linkViewAttr.href,
            theme: theme,
            "custom-title": linkViewAttr?.["custom-title"],
            "custom-description": linkViewAttr?.["custom-description"],
          })
        );
        return true;
      })
      .run();
    return;
  }
};

export default linkViewTypes;
