import assert from "assert";
import * as d3 from "../../src/index.js";

const tree = {id: "root", children: [{id: "a", children: [{id: "ab"}]}, {id: "b", children: [{id: "ba"}]}]};

it("node.each() traverses a hierarchy in breadth-first order", () => {
  const root = d3.hierarchy(tree);
  
  const a = [];
  root.each(function(d) { a.push(d.data.id); });
  assert.deepStrictEqual(a, [ 'root', 'a', 'b', 'ab', 'ba' ]);
});

it("node.eachBefore() traverses a hierarchy in pre-order traversal", () => {
  const root = d3.hierarchy(tree);
  
  const a = [];
  root.eachBefore(function(d) { a.push(d.data.id); });
  assert.deepStrictEqual(a, [ 'root', 'a', 'ab', 'b', 'ba' ]);
});

it("node.eachAfter() traverses a hierarchy in post-order traversal", () => {
  const root = d3.hierarchy(tree);
  
  const a = [];
  root.eachAfter(function(d) { a.push(d.data.id); });
  assert.deepStrictEqual(a, [ 'ab', 'a', 'ba', 'b', 'root' ]);
});

it("a hierarchy is an iterable equivalent to *node*.each()", () => {
  const root = d3.hierarchy(tree);
  
  const a = [];
  for (const d of root) a.push(d.data.id);
  assert.deepStrictEqual(a, [ 'root', 'a', 'b', 'ab', 'ba' ]);
});

