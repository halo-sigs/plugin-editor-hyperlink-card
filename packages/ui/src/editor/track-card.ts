import type { Editor, Transaction } from "@halo-dev/richtext-editor";

type Card = Editor["state"]["doc"];

function findCard(doc: Card, target: Card) {
  let position: number | undefined;
  doc.descendants((node, pos) => {
    if (node === target) position = pos;
  });
  return position;
}

// Track each replacement, including the paragraph wrapper added by block/inline conversion.
// A deletion has no replacement card and must never adopt its new neighbour.
export function trackCard(editor: Editor, target: Card, onChange = () => {}) {
  const tracked = {
    node: target as Card | undefined,
    position: findCard(editor.state.doc, target),
    stop: () => editor.off("transaction", update),
  };
  if (tracked.position === undefined) tracked.node = undefined;

  function update({ transaction }: { transaction: Transaction }) {
    if (!tracked.node || !transaction.docChanged) return;
    for (let i = 0; i < transaction.steps.length; i++) {
      const before = transaction.docs[i]!;
      const after = transaction.docs[i + 1] || transaction.doc;
      const current: Card | undefined = tracked.node;
      if (!current) break;
      const position = findCard(before, current);
      let next: Card = current;
      let nextPosition = findCard(after, current);
      if (position === undefined) break;
      if (nextPosition === undefined) {
        const replacements: { node: Card; pos: number }[] = [];
        let hasReplacements = false;
        transaction.steps[i]!.getMap().forEach((from, to, newFrom, newTo) => {
          hasReplacements = true;
          if (from > position || to < position + current.nodeSize || newFrom === newTo) return;
          let removedCards = 0;
          before.nodesBetween(from, to, (node) => {
            if (["hyperlinkCard", "hyperlinkInlineCard"].includes(node.type.name)) removedCards++;
          });
          if (removedCards !== 1) return;
          after.nodesBetween(newFrom, newTo, (node, pos) => {
            if (["hyperlinkCard", "hyperlinkInlineCard"].includes(node.type.name)) {
              replacements.push({ node, pos });
            }
          });
        });
        // Mark and attribute steps preserve positions without exposing replacement ranges.
        const samePosition = after.nodeAt(position);
        if (!hasReplacements && samePosition?.type === current.type) {
          replacements.push({ node: samePosition, pos: position });
        }
        if (replacements.length === 1) {
          next = replacements[0]!.node;
          nextPosition = replacements[0]!.pos;
        }
      }
      tracked.node = nextPosition === undefined ? undefined : next;
      tracked.position = nextPosition;
    }
    onChange();
    if (!tracked.node) tracked.stop();
  }

  editor.on("transaction", update);
  return tracked;
}
