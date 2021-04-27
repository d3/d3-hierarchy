import assert from "assert";
import * as d3 from "../../src/index.js";

it("node.links() returns an array of {source, target}", () => {
  const root = d3.hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}),
      a = root.children[0],
      b = root.children[1],
      ba = root.children[1].children[0];
  assert.deepStrictEqual(root.links(), [
    {source: root, target: a},
    {source: root, target: b},
    {source: b, target: ba}
  ]);
});
