import {
  PMNode,
  TextSelection,
  canSplit,
  type Transaction,
} from "@halo-dev/richtext-editor";

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

export interface NodePath {
  node: PMNode;
  index: number;
  offset: number;
}

export const resolve = (doc: PMNode, pos: number): NodePath[] => {
  if (pos < 0 || pos > doc.content.size) {
    throw new RangeError("Position " + pos + " out of range");
  }

  const path: NodePath[] = [];
  let start = 0;
  let parentOffset = pos;
  let node: PMNode | null = doc;

  while (node) {
    const { index, offset } = node.content.findIndex(parentOffset);
    const rem = parentOffset - offset;
    path.push({ node, index, offset: start + offset });
    if (rem === 0) {
      break;
    }

    node = node.child(index);
    if (node.isText) {
      break;
    }
    parentOffset = rem - 1;
    start += offset + 1;
  }

  return path;
};
