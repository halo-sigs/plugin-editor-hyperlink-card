import { hyperlinkApi } from "@/api";
import { Toast } from "@halo-dev/components";
import { closeHistory, type Editor } from "@halo-dev/richtext-editor";
import { utils } from "@halo-dev/ui-shared";

export const FETCH_PERMISSION = "plugin:hyperlink-card:fetch";

export function canFetchLinkData() {
  return !!utils.permission.getUserPermissions() && utils.permission.has([FETCH_PERMISSION]);
}

export function selectedCard(editor: Editor, name: string) {
  const { selection } = editor.state;
  const node = editor.state.doc.nodeAt(selection.from);
  if (node?.type.name === name) return node;
  const previous = selection.$from.nodeBefore;
  return previous?.type.name === name ? previous : undefined;
}

export async function refreshCard(
  editor: Editor,
  target: Editor["state"]["doc"],
  automatic = false
) {
  if (!canFetchLinkData()) return;
  try {
    const { data } = await hyperlinkApi.fetchEditorHyperLinkDetail(
      { url: target.attrs.href },
      { mute: true }
    );
    if (editor.isDestroyed) return;
    let position: number | undefined;
    editor.state.doc.descendants((node, pos) => {
      if (node === target) position = pos;
    });
    // A changed or deleted node invalidates this request, even if selection moved elsewhere.
    if (position === undefined) return;
    editor.commands.command(({ tr }) => {
      tr.setNodeMarkup(position!, undefined, {
        ...target.attrs,
        "data-mode": "snapshot",
        "custom-title": data.title || target.attrs.href,
        "custom-description": data.description || null,
        "custom-icon": data.icon || data.image || null,
        "custom-image": data.image || data.icon || null,
      });
      if (automatic) tr.setMeta("addToHistory", false);
      else closeHistory(tr as unknown as Parameters<typeof closeHistory>[0]);
      return true;
    });
    if (!automatic) Toast.success("链接信息已更新，可撤销");
    return editor.state.doc.nodeAt(position);
  } catch {
    if (!editor.isDestroyed) Toast.warning("获取链接信息失败，可重试或手动编辑");
  }
}
