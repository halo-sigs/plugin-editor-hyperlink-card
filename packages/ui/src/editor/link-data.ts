import { hyperlinkApi } from "@/api";
import { Toast } from "@halo-dev/components";
import { closeHistory, type Editor } from "@halo-dev/richtext-editor";
import { utils } from "@halo-dev/ui-shared";
import { shallowReactive } from "vue";
import { trackCard } from "./track-card";

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
  let current = target;
  const tracked = trackCard(editor, target, () => {
    fetchingCards.delete(current);
    const next = tracked.node;
    if (
      next &&
      ["href", "custom-title", "custom-description", "custom-icon", "custom-image"].every(
        (key) => next.attrs[key] === target.attrs[key]
      )
    ) {
      current = next;
      fetchingCards.add(current);
    } else {
      tracked.node = undefined;
      tracked.stop();
    }
  });
  if (!tracked.node) {
    tracked.stop();
    return;
  }
  fetchingCards.add(current);
  try {
    const { data } = await hyperlinkApi.fetchEditorHyperLinkDetail(
      { url: target.attrs.href },
      { mute: true }
    );
    if (editor.isDestroyed) return;
    if (!tracked.node || tracked.position === undefined) return;
    const position = tracked.position;
    tracked.stop();
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
    if (!editor.isDestroyed && tracked.node) Toast.warning("获取链接信息失败，可重试或手动编辑");
  } finally {
    tracked.stop();
    fetchingCards.delete(current);
  }
}
