import assert from "node:assert";
import {it} from "vitest";
import {hierarchy} from "../../src/index.js";

it("node.copy() copies values", () => {
  const root = hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}).count();
  assert.strictEqual(root.copy().value, 2);
});
