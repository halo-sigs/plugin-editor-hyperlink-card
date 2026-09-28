import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire, stripTypeScriptTypes } from "node:module";
import vm from "node:vm";

const require = createRequire(new URL("../package.json", import.meta.url));
const { shallowReactive, effect } = require("vue");
let allowed = true;
let settle;
let requests = 0;
const context = vm.createContext({
  shallowReactive,
  utils: { permission: { getUserPermissions: () => [], has: () => allowed } },
  Toast: { warning() {} },
  hyperlinkApi: {
    fetchEditorHyperLinkDetail() {
      requests++;
      return new Promise((resolve, reject) => {
        settle = { resolve, reject };
      });
    },
  },
});
const source = readFileSync(new URL("../src/editor/link-data.ts", import.meta.url), "utf8");
vm.runInContext(
  stripTypeScriptTypes(source.replace(/^import .*;\n/gm, "").replace(/^export /gm, "")),
  context
);
const { refreshCard, fetchingCards } = vm.runInContext("({ refreshCard, fetchingCards })", context);
const target = { attrs: { href: "https://example.com" } };
const editor = {
  isDestroyed: false,
  on() {},
  off() {},
  state: {
    doc: {
      descendants(fn) {
        fn(target, 0);
      },
      nodeAt() {
        return target;
      },
    },
  },
  commands: { command() {} },
};
const states = [];
effect(() => states.push(fetchingCards.has(target)));
for (const outcome of ["resolve", "reject"]) {
  const pending = refreshCard(editor, target, true);
  assert.equal(fetchingCards.has(target), true);
  const count = requests;
  await refreshCard(editor, target, true);
  assert.equal(requests, count, "Do not duplicate an in-flight request");
  settle[outcome]({ data: {} });
  await pending;
  assert.equal(fetchingCards.has(target), false);
}
assert.deepEqual(states, [false, true, false, true, false]);
allowed = false;
await refreshCard(editor, target, true);
assert.equal(requests, 2);
assert.equal(fetchingCards.has(target), false);
console.log("Loading is reactive, cleared on success/failure, and permission guarded.");
