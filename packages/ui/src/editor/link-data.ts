import { hyperlinkApi } from "@/api";
import { Toast } from "@halo-dev/components";
import { closeHistory, type Editor, type Transaction } from "@halo-dev/richtext-editor";
import { utils } from "@halo-dev/ui-shared";
import { shallowReactive } from "vue";

export const fetchingCards = shallowReactive(new WeakSet<object>());

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
  if (!canFetchLinkData() || fetchingCards.has(target)) return;
  let position: number | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (node === target) position = pos;
  });
  if (position === undefined) return;
  let current = target;
  const track = ({ transaction }: { transaction: Transaction }) => {
    if (position === undefined || !transaction.docChanged) return;
    let mapped = transaction.mapping.map(position, -1);
    transaction.doc.descendants((node, pos) => {
      if (node === current) mapped = pos;
    });
    const next = transaction.doc.nodeAt(mapped);
    fetchingCards.delete(current);
    // Presentation changes are safe; URL or manual metadata edits invalidate the response.
    if (
      !next ||
      !["hyperlinkCard", "hyperlinkInlineCard"].includes(next.type.name) ||
      ["href", "custom-title", "custom-description", "custom-icon", "custom-image"].some(
        (key) => next.attrs[key] !== target.attrs[key]
      )
    ) {
      position = undefined;
      return;
    }
    position = mapped;
    current = next;
    fetchingCards.add(current);
  };
  fetchingCards.add(current);
  editor.on("transaction", track);
  try {
    const { data } = await hyperlinkApi.fetchEditorHyperLinkDetail(
      { url: target.attrs.href },
      { mute: true }
    );
    if (editor.isDestroyed) return;
    if (position === undefined) return;
    editor.off("transaction", track);
    editor.commands.command(({ tr }) => {
      tr.setNodeMarkup(position!, undefined, {
        ...current.attrs,
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
    if (!automatic) Toast.success("链接信息已更新");
    return editor.state.doc.nodeAt(position);
  } catch {
    if (!editor.isDestroyed) Toast.warning("获取链接信息失败，可重试或手动编辑");
  } finally {
    editor.off("transaction", track);
    fetchingCards.delete(current);
  }
}
