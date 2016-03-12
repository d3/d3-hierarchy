var tape = require("tape"),
    d3_hierarchy = require("../");

tape("hierarchy() has the expected defaults", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.equal(h.id()(null, 42), 42);
  test.equal(h.parentId()({parent: "foo"}), "foo");
  test.equal(h.value()({value: 42}), 42);
  test.ok(h.sort()({value: 1}, {value: 2}) > 0);
  test.ok(h.sort()({value: 2}, {value: 1}) < 0);
  test.equal(h.sort()({value: 1}, {value: 1}), 0);
  test.end();
});

tape("hierarchy(data) returns an array of nodes for each datum, plus the root", function(test) {
  var h = d3_hierarchy.hierarchy(),
      a = {},
      aa = {parent: 0},
      ab = {parent: 0},
      aaa = {parent: 1},
      nodes = h([a, aa, ab, aaa]),
      parents = nodes.map(function(d) { var p = d.parent; delete d.parent; return p; }),
      AAA = {data: aaa, index: 3, id: "3", depth: 3, value: 0, children: []},
      AB = {data: ab, index: 2, id: "2", depth: 2, value: 0, children: []},
      AA = {data: aa, index: 1, id: "1", depth: 2, value: 0, children: [AAA]},
      A = {data: a, index: 0, id: "0", depth: 1, value: 0, children: [AA, AB]},
      ROOT = {depth: 0, value: 0, children: [A]};
  test.deepEqual(nodes, [ROOT, A, AA, AB, AAA]);
  test.deepEqual(parents, [undefined, ROOT, A, A, AA]);
  test.end();
});

tape("hierarchy(data) does not require the data to be in topological order", function(test) {
  var h = d3_hierarchy.hierarchy(),
      a = {},
      aa = {parent: 1},
      nodes = h([aa, a]),
      parents = nodes.map(function(d) { var p = d.parent; delete d.parent; return p; }),
      AA = {data: aa, index: 0, id: "0", depth: 2, value: 0, children: []},
      A = {data: a, index: 1, id: "1", depth: 1, value: 0, children: [AA]},
      ROOT = {depth: 0, value: 0, children: [A]};
  test.deepEqual(nodes, [ROOT, A, AA]);
  test.deepEqual(parents, [undefined, ROOT, A]);
  test.end();
});

tape("hierarchy(data) does not require the data to have a single root", function(test) {
  var h = d3_hierarchy.hierarchy(),
      a = {},
      b = {},
      nodes = h([a, b]),
      parents = nodes.map(function(d) { var p = d.parent; delete d.parent; return p; }),
      A = {data: a, index: 0, id: "0", depth: 1, value: 0, children: []},
      B = {data: b, index: 1, id: "1", depth: 1, value: 0, children: []},
      ROOT = {depth: 0, value: 0, children: [A, B]};
  test.deepEqual(nodes, [ROOT, A, B]);
  test.deepEqual(parents, [undefined, ROOT, ROOT]);
  test.end();
});

// tape("hierarchy(data) throws an error if multiple nodes have the same id", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) throws an error if the specified parent is not found", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) coerces the id to a string, even if null", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) coerces the parent id to a string if not null", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) coerces the value to a number, and treats NaN as zero", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) aggregates values from the leaves", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) aggregates values from internal nodes, too", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });

// tape("hierarchy(data) sorts nodes by depth and sibling order", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.end();
// });
