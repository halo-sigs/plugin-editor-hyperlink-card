import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { insertCard } from "../src/editor/insert-card.ts";

const require = createRequire(import.meta.resolve("@halo-dev/richtext-editor"));
const { Schema } = require("@tiptap/pm/model");
const { EditorState, TextSelection } = require("@tiptap/pm/state");
const { history, undo } = require("@tiptap/pm/history");
const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { content: "inline*", group: "block" },
    text: { group: "inline" },
    inlineCard: { inline: true, group: "inline", atom: true, attrs: { title: {} } },
    blockCard: { group: "block", atom: true, attrs: { title: {} } },
  },
  marks: { link: {} },
});
const paragraph = (...content) => schema.nodes.paragraph.create(null, content);
const originalB = schema.nodes.inlineCard.create({ title: "Manual B" });
for (const [name, content] of [
  ["inlineCard", [paragraph(schema.text("A", [schema.marks.link.create()]), originalB)]],
  ["blockCard", [paragraph(schema.text("A")), paragraph(schema.text("Next"))]],
]) {
  const original = schema.nodes.doc.create(null, content);
  let state = EditorState.create({ doc: original, plugins: [history()] });
  state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1, 2)));
  const tr = state.tr;
  const inserted = insertCard(tr, schema.nodes[name].create({ title: "A" }));
  state = state.apply(tr);
  assert.equal(inserted?.attrs.title, "A", `${name}: must target A, not the next node`);
  let position;
  state.doc.descendants((node, pos) => {
    if (node === inserted) position = pos;
  });
  assert.notEqual(position, undefined, "must return the actual committed node");
  state = state.apply(
    state.tr
      .setNodeMarkup(position, undefined, { title: "Fetched A" })
      .setMeta("addToHistory", false)
  );
  undo(state, (transaction) => {
    state = state.apply(transaction);
  });
  assert.ok(state.doc.eq(original), `${name}: undo must restore A and preserve its neighbours`);
}
console.log("Card insertion regression checks passed");
