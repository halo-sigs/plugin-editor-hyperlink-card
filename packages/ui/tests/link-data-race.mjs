import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire, stripTypeScriptTypes } from "node:module";
import path from "node:path";
import vm from "node:vm";

const root = new URL("../../..", import.meta.url).pathname;
const ui = path.join(root, "packages/ui");
const editorPackage = fs.realpathSync(path.join(ui, "node_modules/@halo-dev/richtext-editor"));
const pm = createRequire(path.join(editorPackage, "package.json"));
const { Schema } = pm("@tiptap/pm/model");
const { EditorState, NodeSelection } = pm("@tiptap/pm/state");
const { closeHistory, history } = pm("@tiptap/pm/history");
const nodeSpecs = {
  doc: { content: "block+" },
  text: { group: "inline" },
  paragraph: { group: "block", content: "inline*" },
  hyperlinkCard: {
    group: "block",
    atom: true,
    attrs: {
      href: { default: null },
      "data-mode": { default: "snapshot" },
      "custom-title": { default: null },
      "custom-description": { default: null },
      "custom-image": { default: null },
      "custom-icon": { default: null },
      target: { default: "_blank" },
    },
  },
};
nodeSpecs.hyperlinkInlineCard = { ...nodeSpecs.hyperlinkCard, group: "inline", inline: true };
const schema = new Schema({ nodes: nodeSpecs, marks: { bold: {} } });
let state = EditorState.create({
  schema,
  doc: schema.nodes.doc.create(
    null,
    schema.nodes.hyperlinkCard.create({ href: "https://a.example" })
  ),
  plugins: [history()],
});
state = state.apply(state.tr.setSelection(NodeSelection.create(state.doc, 0)));
const listeners = new Set();
const editor = {
  on(_event, fn) {
    listeners.add(fn);
  },
  off(_event, fn) {
    listeners.delete(fn);
  },
  isDestroyed: false,
  get state() {
    return state;
  },
  commands: {
    command(fn) {
      const tr = state.tr;
      const result = fn({ tr });
      state = state.apply(tr);
      for (const listener of listeners) listener({ transaction: tr });
      return result;
    },
  },
  getAttributes() {
    return state.doc.firstChild.attrs;
  },
};
let resolveRequest;
let rejectRequest;
const warnings = [];
const requests = [];
// Actual application functions run against ProseMirror; UI primitives and network are mocked.
const context = vm.createContext({
  console,
  Promise,
  shallowReactive: createRequire(path.join(ui, "package.json"))("vue").shallowReactive,
  defineProps: () => ({ editor, name: "hyperlinkCard" }),
  onBeforeUnmount() {},
  ref: (value) => ({ value }),
  computed: (value) => value,
  closeHistory,
  Toast: {
    success() {},
    warning(message) {
      warnings.push(message);
    },
  },
  utils: { permission: { getUserPermissions: () => ["*"], has: () => true } },
  hyperlinkApi: {
    fetchEditorHyperLinkDetail({ url }) {
      requests.push(url);
      return new Promise((resolve, reject) => {
        rejectRequest = reject;
        resolveRequest = resolve;
      });
    },
  },
});
const clean = (source) =>
  stripTypeScriptTypes(source.replace(/^import[\s\S]*?;\n/gm, "").replace(/^export /gm, ""), {
    mode: "transform",
  });
vm.runInContext(clean(fs.readFileSync(path.join(ui, "src/editor/track-card.ts"), "utf8")), context);
vm.runInContext(clean(fs.readFileSync(path.join(ui, "src/editor/link-data.ts"), "utf8")), context);
context.editor = editor;
const pending = vm.runInContext("refreshCard(editor, editor.state.doc.firstChild, true)", context);
editor.commands.command(({ tr }) =>
  tr.setNodeMarkup(0, undefined, { ...state.doc.firstChild.attrs, target: "_self" })
);
resolveRequest({ data: { title: "NewsNow" } });
await pending;
assert.equal(state.doc.firstChild.attrs["custom-title"], "NewsNow");
assert.equal(state.doc.firstChild.attrs.target, "_self");
assert.equal(listeners.size, 0);
console.log("Metadata survives target changes during slow requests.");

// A newer URL or manual title must never be overwritten by the earlier response.
for (const change of [{ href: "https://new.example" }, { "custom-title": "Manual title" }]) {
  const pending = vm.runInContext(
    "refreshCard(editor, editor.state.doc.firstChild, true)",
    context
  );
  editor.commands.command(({ tr }) =>
    tr.setNodeMarkup(0, undefined, { ...state.doc.firstChild.attrs, ...change })
  );
  resolveRequest({ data: { title: "Stale response" } });
  await pending;
  for (const [key, value] of Object.entries(change))
    assert.equal(state.doc.firstChild.attrs[key], value);
  assert.equal(listeners.size, 0);
}
const deleted = vm.runInContext("refreshCard(editor, editor.state.doc.firstChild, true)", context);
editor.commands.command(({ tr }) => tr.delete(0, state.doc.firstChild.nodeSize));
resolveRequest({ data: { title: "Deleted response" } });
await deleted;
assert.notEqual(state.doc.firstChild?.attrs["custom-title"], "Deleted response");
assert.equal(listeners.size, 0);

const { refreshCard, fetchingCards } = vm.runInContext("({refreshCard, fetchingCards})", context);
const card = () => schema.nodes.hyperlinkCard.create({ href: "https://a.example" });
function reset(content) {
  assert.equal(listeners.size, 0);
  state = EditorState.create({
    schema,
    doc: schema.nodes.doc.create(null, content),
    plugins: [history()],
  });
  state = state.apply(state.tr.setSelection(NodeSelection.create(state.doc, 0)));
}

// Deleting the first identical card must not transfer its request to its neighbour.
for (const fail of [false, true]) {
  reset([card(), card()]);
  const pending = refreshCard(editor, state.doc.firstChild, true);
  editor.commands.command(({ tr }) => tr.delete(0, 1));
  assert.equal(fetchingCards.has(state.doc.firstChild), false);
  if (fail) rejectRequest(new Error("Late failure"));
  else resolveRequest({ data: { title: "Wrong card" } });
  await pending;
  assert.equal(state.doc.firstChild.attrs["custom-title"], null);
  assert.equal(warnings.length, 0, "Deleted requests must fail silently");
}

// Follow the real fitted replacement, including wrappers in both directions.
for (const direction of ["inline", "block"]) {
  reset(card());
  if (direction === "block") {
    editor.commands.command(({ tr }) =>
      tr.replaceSelectionWith(schema.nodes.hyperlinkInlineCard.create(card().attrs))
    );
    state = state.apply(state.tr.setSelection(NodeSelection.create(state.doc, 1)));
  }
  const original = state.doc.nodeAt(state.selection.from);
  const pending = refreshCard(editor, original, true);
  const type =
    direction === "inline" ? schema.nodes.hyperlinkInlineCard : schema.nodes.hyperlinkCard;
  editor.commands.command(({ tr }) => tr.replaceSelectionWith(type.create(original.attrs)));
  let converted;
  state.doc.descendants((node) => {
    if (node.type === type) converted = node;
  });
  assert.equal(fetchingCards.has(converted), true);
  resolveRequest({ data: { title: "Converted" } });
  await pending;
  state.doc.descendants((node) => {
    if (node.type === type) converted = node;
  });
  assert.equal(converted.attrs["custom-title"], "Converted");
  assert.equal(fetchingCards.has(converted), false);
}

// An insertion before the target and a presentation change in one transaction.
reset(card());
const moving = refreshCard(editor, state.doc.firstChild, true);
editor.commands.command(({ tr }) => {
  tr.insert(0, schema.nodes.paragraph.create());
  tr.setNodeMarkup(2, undefined, { ...tr.doc.nodeAt(2).attrs, target: "_self" });
  return true;
});
resolveRequest({ data: { title: "Moved" } });
await moving;
assert.equal(state.doc.nodeAt(2).attrs["custom-title"], "Moved");

// The popup must follow automatic fetch results while preserving its draft.
reset(card());
const sfc = fs.readFileSync(path.join(ui, "src/components/HyperlinkBubbleButton.vue"), "utf8");
vm.runInContext(clean(sfc.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]), context);
const popupRequest = refreshCard(editor, state.doc.firstChild, true);
vm.runInContext('startEditing(); draftHref.value = "https://b.example"', context);
resolveRequest({ data: { title: "Fetched A" } });
await popupRequest;
vm.runInContext("applyHref()", context);
assert.equal(state.doc.firstChild.attrs.href, "https://b.example");
resolveRequest({ data: { title: "Fetched B" } });
await new Promise((resolve) => setImmediate(resolve));
assert.equal(state.doc.firstChild.attrs["custom-title"], "Fetched B");
vm.runInContext("stopEditing()", context);
assert.equal(listeners.size, 0);
console.log("Deletion, late errors, block/inline conversion, movement and popup races passed.");

// Mark-only transactions have an empty StepMap but still replace inline node objects.
reset(schema.nodes.paragraph.create(null, schema.nodes.hyperlinkInlineCard.create(card().attrs)));
const marked = refreshCard(editor, state.doc.nodeAt(1), true);
editor.commands.command(({ tr }) => tr.addMark(1, 2, schema.marks.bold.create()));
assert.equal(fetchingCards.has(state.doc.nodeAt(1)), true);
resolveRequest({ data: { title: "Bold card" } });
await marked;
assert.equal(state.doc.nodeAt(1).attrs["custom-title"], "Bold card");
assert.equal(state.doc.nodeAt(1).marks[0].type.name, "bold");
assert.equal(listeners.size, 0);
