import {test} from "vitest";
import assert from "assert";
import {hierarchy} from "../../src/index.js";

test("node.copy() copies values", () => {
  const root = hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}).count();
  assert.strictEqual(root.copy().value, 2);
});
