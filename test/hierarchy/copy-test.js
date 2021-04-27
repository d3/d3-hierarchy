import assert from "assert";
import * as d3 from "../../src/index.js";

it("node.copy() copies values", () => {
  const root = d3.hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}).count();
  assert.strictEqual(root.copy().value, 2);
});
