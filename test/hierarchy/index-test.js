import assert from "assert";
import * as d3 from "../../src/index.js";

it("d3.hierarchy(data, children) supports iterable children", () => {
  const root = d3.hierarchy({id: "root", children: new Set([{id: "a"}, {id: "b", children: new Set([{id: "ba"}])}])}),
      a = root.children[0],
      b = root.children[1],
      ba = root.children[1].children[0];
  assert.deepStrictEqual(root.links(), [
    {source: root, target: a},
    {source: root, target: b},
    {source: b, target: ba}
  ]);
});

it("d3.hierarchy(data, children) ignores non-iterable children", () => {
  const root = d3.hierarchy({id: "root", children: [{id: "a", children: null}, {id: "b", children: 42}]}),
      a = root.children[0],
      b = root.children[1];
  assert.deepStrictEqual(root.links(), [
    {source: root, target: a},
    {source: root, target: b}
  ]);
});
