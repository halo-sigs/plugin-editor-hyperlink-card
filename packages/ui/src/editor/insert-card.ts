import type { Editor, Transaction } from "@halo-dev/richtext-editor";

export function insertCard(tr: Transaction, card: Editor["state"]["doc"]) {
  tr.replaceSelectionWith(card);
  let inserted: typeof card | undefined;
  // Replacement can fit a block into its parent or add marks, creating a new node.
  // Read the inserted range instead of the selection, which may be in the next node.
  tr.mapping.maps[tr.mapping.maps.length - 1]?.forEach((_from, _to, from, to) => {
    tr.doc.nodesBetween(from, to, (node) => {
      if (node.type === card.type) inserted = node;
    });
  });
  return inserted;
}
