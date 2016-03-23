var tape = require("tape"),
    d3_hierarchy = require("../");

tape("hierarchy() has the expected defaults", function(test) {
  var h = d3_hierarchy.hierarchy();
  test.equal(h.id()({id: "foo"}), "foo");
  test.equal(h.parentId(), null);
  test.deepEqual(h.children()({children: [1, 2]}), [1, 2]);
  test.equal(h.value()({value: 42}), 42);
  test.ok(h.sort()({value: 1}, {value: 2}) > 0);
  test.ok(h.sort()({value: 2}, {value: 1}) < 0);
  test.equal(h.sort()({value: 1}, {value: 1}), 0);
  test.end();
});

tape("hierarchy.parentId(…)(data) returns a root node", function(test) {
  var h = d3_hierarchy.hierarchy().parentId(function(d) { return d.parent; }),
      a = {id: "a"},
      aa = {id: "aa", parent: "a"},
      ab = {id: "ab", parent: "a"},
      aaa = {id: "aaa", parent: "aa"},
      data = [a, aa, ab, aaa],
      root = h(data),
      AAA = {data: aaa, index: 3, id: "aaa", depth: 3, value: 0},
      AB = {data: ab, index: 2, id: "ab", depth: 2, value: 0},
      AA = {data: aa, index: 1, id: "aa", depth: 2, value: 0, children: [AAA]},
      A = {data: a, index: 0, id: "a", depth: 1, value: 0, children: [AA, AB]},
      ROOT = {data: data, depth: 0, value: 0, children: [A]};
  test.deepEqual(noparents(root), [ROOT, A, AA, AB, AAA]);
  test.deepEqual(parents(root), [undefined, ROOT, A, A, AA]);
  test.end();
});

// tape("hierarchy(data) does not require the data to be in topological order", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root"},
//       a = {id: "a", parent: "root"},
//       aa = {id: "aa", parent: "a"},
//       nodes = h([aa, a, root]),
//       AA = {data: aa, index: 0, id: "aa", depth: 2, value: 0},
//       A = {data: a, index: 1, id: "a", depth: 1, value: 0, children: [AA]},
//       ROOT = {data: root, index: 2, id: "root", depth: 0, value: 0, children: [A]};
//   test.deepEqual(noparents(nodes), [ROOT, A, AA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, A]);
//   test.end();
// });

// tape("hierarchy(data) requires the data to have a single root", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.throws(function() { h([{id: "a"}, {id: "b"}]); }, /\bmultiple roots\b/);
//   test.end();
// });

// tape("hierarchy(data) throws an error if the hierarchy is cyclical", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       a = {id: "a", parent: "b"},
//       b = {id: "b", parent: "a"};
//   test.throws(function() { h([a, b]); }, /\bcycle\b/);
//   test.end();
// });

// tape("hierarchy(data) throws an error if the hierarchy is trivially cyclical", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       a = {id: "a", parent: "a"};
//   test.throws(function() { h([a]); }, /\bcycle\b/);
//   test.end();
// });

// tape("hierarchy(data) throws an error if multiple nodes have the same id", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.throws(function() { h([{id: "foo"}, {id: "foo"}]); }, /\bduplicate\b/);
//   test.end();
// });

// tape("hierarchy(data) throws an error if the specified parent is not found", function(test) {
//   var h = d3_hierarchy.hierarchy();
//   test.throws(function() { h([{id: "a"}, {id: "b", parent: "c"}]); }, /\bmissing\b/);
//   test.end();
// });

// tape("hierarchy(data) allows the id to be undefined for leaf nodes", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root"},
//       a = {parent: "root"},
//       b = {parent: "root"},
//       nodes = h([a, b, root]),
//       B = {data: b, index: 1, depth: 1, value: 0},
//       A = {data: a, index: 0, depth: 1, value: 0},
//       ROOT = {data: root, index: 2, id: "root", depth: 0, value: 0, children: [A, B]};
//   test.deepEqual(noparents(nodes), [ROOT, A, B]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, ROOT]);
//   test.end();
// });

// tape("hierarchy(data) coerces the id to a string if defined", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root"},
//       a = {id: {toString: function() { return "a"; }}, parent: "root"},
//       aa = {id: "aa", parent: "a"},
//       nodes = h([a, aa, root]),
//       AA = {data: aa, index: 1, id: "aa", depth: 2, value: 0},
//       A = {data: a, index: 0, id: "a", depth: 1, value: 0, children: [AA]},
//       ROOT = {data: root, index: 2, id: "root", depth: 0, value: 0, children: [A]};
//   test.deepEqual(noparents(nodes), [ROOT, A, AA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, A]);
//   test.end();
// });

// tape("hierarchy(data) coerces the parent id to a string", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root"},
//       a = {id: "a", parent: "root"},
//       aa = {id: "aa", parent: {toString: function() { return "a"; }}},
//       nodes = h([a, aa, root]),
//       AA = {data: aa, index: 1, id: "aa", depth: 2, value: 0},
//       A = {data: a, index: 0, id: "a", depth: 1, value: 0, children: [AA]},
//       ROOT = {data: root, index: 2, id: "root", depth: 0, value: 0, children: [A]};
//   test.deepEqual(noparents(nodes), [ROOT, A, AA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, A]);
//   test.end();
// });

// tape("hierarchy(data) coerces the value to a number", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root", value: {valueOf: function() { return 42; }}},
//       nodes = h([root]),
//       ROOT = {data: root, index: 0, id: "root", depth: 0, value: 42};
//   test.deepEqual(noparents(nodes), [ROOT]);
//   test.deepEqual(parents(nodes), [undefined]);
//   test.end();
// });

// tape("hierarchy(data) treats NaN values as zero", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root", value: NaN},
//       nodes = h([root]),
//       ROOT = {data: root, index: 0, id: "root", depth: 0, value: 0};
//   test.deepEqual(noparents(nodes), [ROOT]);
//   test.deepEqual(parents(nodes), [undefined]);
//   test.end();
// });

// tape("hierarchy(data) aggregates values from the leaves and internal nodes", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root"},
//       a = {id: "a", value: 1, parent: "root"},
//       aa = {id: "aa", value: 3, parent: "a"},
//       ab = {id: "ab", value: 7, parent: "a"},
//       aaa = {id: "aaa", value: 12, parent: "aa"},
//       nodes = h([a, aa, ab, aaa, root]),
//       AAA = {data: aaa, index: 3, id: "aaa", depth: 3, value: 12},
//       AB = {data: ab, index: 2, id: "ab", depth: 2, value: 7},
//       AA = {data: aa, index: 1, id: "aa", depth: 2, value: 15, children: [AAA]},
//       A = {data: a, index: 0, id: "a", depth: 1, value: 23, children: [AA, AB]},
//       ROOT = {data: root, index: 4, id: "root", depth: 0, value: 23, children: [A]};
//   test.deepEqual(noparents(nodes), [ROOT, A, AA, AB, AAA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, A, A, AA]);
//   test.end();
// });

// tape("hierarchy(data) sorts nodes by depth and sibling order", function(test) {
//   var h = d3_hierarchy.hierarchy(),
//       root = {id: "root"},
//       a = {id: "a", parent: "root"},
//       aa = {id: "aa", value: 1, parent: "a"},
//       ab = {id: "ab", value: 3, parent: "a"},
//       ac = {id: "ac", value: 2, parent: "a"},
//       ad = {id: "ad", value: 4, parent: "a"},
//       b = {id: "b", parent: "root"},
//       ba = {id: "ba", value: 2, parent: "b"},
//       bb = {id: "bb", value: 1, parent: "b"},
//       nodes = h([ab, ac, a, ad, b, aa, root, ba, bb]),
//       BA = {data: ba, index: 7, id: "ba", depth: 2, value: 2},
//       BB = {data: bb, index: 8, id: "bb", depth: 2, value: 1},
//       B = {data: b, index: 4, id: "b", depth: 1, value: 3, children: [BA, BB]},
//       AD = {data: ad, index: 3, id: "ad", depth: 2, value: 4},
//       AC = {data: ac, index: 1, id: "ac", depth: 2, value: 2},
//       AB = {data: ab, index: 0, id: "ab", depth: 2, value: 3},
//       AA = {data: aa, index: 5, id: "aa", depth: 2, value: 1},
//       A = {data: a, index: 2, id: "a", depth: 1, value: 10, children: [AD, AB, AC, AA]},
//       ROOT = {data: root, index: 6, id: "root", depth: 0, value: 13, children: [A, B]};
//   test.deepEqual(noparents(nodes), [ROOT, A, B, AD, AB, AC, AA, BA, BB]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, ROOT, A, A, A, A, B, B]);
//   test.end();
// });

// tape("hierarchy.id(id) observes the specified id function", function(test) {
//   var foo = function(d) { return d.foo; },
//       h = d3_hierarchy.hierarchy().id(foo),
//       root = {foo: "root"},
//       a = {foo: "a", parent: "root"},
//       aa = {foo: "aa", value: 1, parent: "a"},
//       ab = {foo: "ab", value: 3, parent: "a"},
//       ac = {foo: "ac", value: 2, parent: "a"},
//       ad = {foo: "ad", value: 4, parent: "a"},
//       b = {foo: "b", parent: "root"},
//       nodes = h([ab, ac, a, ad, b, aa, root]),
//       B = {data: b, index: 4, id: "b", depth: 1, value: 0},
//       AD = {data: ad, index: 3, id: "ad", depth: 2, value: 4},
//       AC = {data: ac, index: 1, id: "ac", depth: 2, value: 2},
//       AB = {data: ab, index: 0, id: "ab", depth: 2, value: 3},
//       AA = {data: aa, index: 5, id: "aa", depth: 2, value: 1},
//       A = {data: a, index: 2, id: "a", depth: 1, value: 10, children: [AD, AB, AC, AA]},
//       ROOT = {data: root, index: 6, id: "root", depth: 0, value: 10, children: [A, B]};
//   test.equal(h.id(), foo);
//   test.deepEqual(noparents(nodes), [ROOT, A, B, AD, AB, AC, AA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, ROOT, A, A, A, A]);
//   test.end();
// });

// tape("hierarchy.parentId(id) observes the specified parent id function", function(test) {
//   var foo = function(d) { return d.foo; },
//       h = d3_hierarchy.hierarchy().parentId(foo),
//       root = {id: "root"},
//       a = {id: "a", foo: "root"},
//       aa = {id: "aa", value: 1, foo: "a"},
//       ab = {id: "ab", value: 3, foo: "a"},
//       ac = {id: "ac", value: 2, foo: "a"},
//       ad = {id: "ad", value: 4, foo: "a"},
//       b = {id: "b", foo: "root"},
//       nodes = h([ab, ac, a, ad, b, aa, root]),
//       B = {data: b, index: 4, id: "b", depth: 1, value: 0},
//       AD = {data: ad, index: 3, id: "ad", depth: 2, value: 4},
//       AC = {data: ac, index: 1, id: "ac", depth: 2, value: 2},
//       AB = {data: ab, index: 0, id: "ab", depth: 2, value: 3},
//       AA = {data: aa, index: 5, id: "aa", depth: 2, value: 1},
//       A = {data: a, index: 2, id: "a", depth: 1, value: 10, children: [AD, AB, AC, AA]},
//       ROOT = {data: root, index: 6, id: "root", depth: 0, value: 10, children: [A, B]};
//   test.equal(h.parentId(), foo);
//   test.deepEqual(noparents(nodes), [ROOT, A, B, AD, AB, AC, AA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, ROOT, A, A, A, A]);
//   test.end();
// });

// tape("hierarchy.value(value) observes the specified value function", function(test) {
//   var foo = function(d) { return d.foo; },
//       h = d3_hierarchy.hierarchy().value(foo),
//       root = {id: "root"},
//       a = {id: "a", parent: "root"},
//       aa = {id: "aa", foo: 1, parent: "a"},
//       ab = {id: "ab", foo: 3, parent: "a"},
//       ac = {id: "ac", foo: 2, parent: "a"},
//       ad = {id: "ad", foo: 4, parent: "a"},
//       b = {id: "b", parent: "root"},
//       nodes = h([ab, ac, a, ad, b, aa, root]),
//       B = {data: b, index: 4, id: "b", depth: 1, value: 0},
//       AD = {data: ad, index: 3, id: "ad", depth: 2, value: 4},
//       AC = {data: ac, index: 1, id: "ac", depth: 2, value: 2},
//       AB = {data: ab, index: 0, id: "ab", depth: 2, value: 3},
//       AA = {data: aa, index: 5, id: "aa", depth: 2, value: 1},
//       A = {data: a, index: 2, id: "a", depth: 1, value: 10, children: [AD, AB, AC, AA]},
//       ROOT = {data: root, index: 6, id: "root", depth: 0, value: 10, children: [A, B]};
//   test.equal(h.value(), foo);
//   test.deepEqual(noparents(nodes), [ROOT, A, B, AD, AB, AC, AA]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, ROOT, A, A, A, A]);
//   test.end();
// });

// tape("hierarchy.sort(sort) observes the specified comparator function", function(test) {
//   var ascendingFoo = function(a, b) { return a.data.foo - b.data.foo; },
//       h = d3_hierarchy.hierarchy().sort(ascendingFoo),
//       root = {id: "root"},
//       a = {id: "a", parent: "root"},
//       aa = {id: "aa", foo: 1, parent: "a"},
//       ab = {id: "ab", foo: 3, parent: "a"},
//       ac = {id: "ac", foo: 2, parent: "a"},
//       ad = {id: "ad", foo: 4, parent: "a"},
//       b = {id: "b", parent: "root"},
//       nodes = h([ab, ac, a, ad, b, aa, root]),
//       B = {data: b, index: 4, id: "b", depth: 1, value: 0},
//       AD = {data: ad, index: 3, id: "ad", depth: 2, value: 0},
//       AC = {data: ac, index: 1, id: "ac", depth: 2, value: 0},
//       AB = {data: ab, index: 0, id: "ab", depth: 2, value: 0},
//       AA = {data: aa, index: 5, id: "aa", depth: 2, value: 0},
//       A = {data: a, index: 2, id: "a", depth: 1, value: 0, children: [AA, AC, AB, AD]},
//       ROOT = {data: root, index: 6, id: "root", depth: 0, value: 0, children: [A, B]};
//   test.equal(h.sort(), ascendingFoo);
//   test.deepEqual(noparents(nodes), [ROOT, A, B, AA, AC, AB, AD]);
//   test.deepEqual(parents(nodes), [undefined, ROOT, ROOT, A, A, A, A]);
//   test.end();
// });

function noparent(node) {
  if (!node) return node;
  var copy = {};
  for (var k in node) {
    if (node.hasOwnProperty(k)) switch (k) {
      case "parent": continue;
      case "children": copy[k] = node.children.map(noparent); break;
      default: copy[k] = node[k]; break;
    }
  }
  return copy;
}

function noparents(root) {
  return root.descendants().map(noparent);
}

function parents(root) {
  return root.descendants().map(function(d) {
    return noparent(d.parent);
  });
}
