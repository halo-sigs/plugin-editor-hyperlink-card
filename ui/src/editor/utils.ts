import { TextSelection, canSplit, type Transaction } from '@halo-dev/richtext-editor';

export const splitLink = (tr: Transaction) => {
  const { selection } = tr;
  const { $from, $to } = selection;
  if (!(selection instanceof TextSelection)) {
    return false;
  }
  if (!$from.parent.isBlock) {
    return false;
  }
  // Cut the node after the selected node
  const atEnd = $to.parentOffset === $to.parent.content.size;
  const canEndSplit = canSplit(tr.doc, tr.mapping.map($to.pos), 1);
  if (!atEnd && canEndSplit) {
    tr.split(tr.mapping.map($to.pos), 1);
  }
  // Cut the node in front of the node
  const atStart = $from.parentOffset === 0;
  const CanStartSplit = canSplit(tr.doc, tr.mapping.map($from.pos), 1);
  if (!atStart && CanStartSplit) {
    tr.split(tr.mapping.map($from.pos), 1);
  }
  return true;
};
