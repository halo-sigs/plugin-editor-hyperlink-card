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
const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    text: { group: "inline" },
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
  },
});
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
const requests = [];
// Actual application functions run against ProseMirror; UI primitives and network are mocked.
const context = vm.createContext({
  console,
  Promise,
  shallowReactive: createRequire(path.join(ui, "package.json"))("vue").shallowReactive,
  defineProps: () => ({ editor, name: "card" }),
  ref: (value) => ({ value }),
  computed: (value) => value,
  closeHistory,
  Toast: { success() {}, warning() {} },
  utils: { permission: { getUserPermissions: () => ["*"], has: () => true } },
  hyperlinkApi: {
    fetchEditorHyperLinkDetail({ url }) {
      requests.push(url);
      return new Promise((resolve) => {
        resolveRequest = resolve;
      });
    },
  },
});
const clean = (source) =>
  stripTypeScriptTypes(source.replace(/^import[\s\S]*?;\n/gm, "").replace(/^export /gm, ""), {
    mode: "transform",
  });
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
