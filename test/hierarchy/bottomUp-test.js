var tape = require("tape"),
    d3_hierarchy = require("../../"),
    noparents = require("./noparents"),
    parents = require("./parents");

tape("hierarchyBottomUp() has the expected defaults", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.equal(h.id()({id: "foo"}), "foo");
  test.equal(h.parentId()({parent: "bar"}), "bar");
  test.end();
});

tape("hierarchyBottomUp(data) returns a root node", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      aa = {id: "aa", parent: "a"},
      ab = {id: "ab", parent: "a"},
      aaa = {id: "aaa", parent: "aa"},
      data = [a, aa, ab, aaa],
      root = h(data),
      AAA = {data: aaa, index: 3, id: "aaa", depth: 3},
      AB = {data: ab, index: 2, id: "ab", depth: 2},
      AA = {data: aa, index: 1, id: "aa", depth: 2, children: [AAA]},
      A = {data: a, index: 0, id: "a", depth: 1, children: [AA, AB]},
      ROOT = {data: data, depth: 0, children: [A]};
  test.deepEqual(noparents(root), [ROOT, A, AA, AB, AAA]);
  test.deepEqual(parents(root), [undefined, ROOT, A, A, AA]);
  test.end();
});

tape("hierarchyBottomUp(data) does not require the data to be in topological order", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      aa = {id: "aa", parent: "a"},
      data = [aa, a],
      root = h(data),
      AA = {data: aa, index: 0, id: "aa", depth: 2},
      A = {data: a, index: 1, id: "a", depth: 1, children: [AA]},
      ROOT = {data: data, depth: 0, children: [A]};
  test.deepEqual(noparents(root), [ROOT, A, AA]);
  test.deepEqual(parents(root), [undefined, ROOT, A]);
  test.end();
});

tape("hierarchyBottomUp(data) does not require the data to have a single root", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      b = {id: "b"},
      data = [a, b],
      root = h(data),
      B = {data: b, index: 1, id: "b", depth: 1},
      A = {data: a, index: 0, id: "a", depth: 1},
      ROOT = {data: data, depth: 0, children: [A, B]};
  test.deepEqual(noparents(root), [ROOT, A, B]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT]);
  test.end();
});

tape("hierarchyBottomUp(data) throws an error if the hierarchy is cyclical", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a", parent: "b"},
      b = {id: "b", parent: "a"};
  test.throws(function() { h([a, b]); }, /\bcycle\b/);
  test.end();
});

tape("hierarchyBottomUp(data) throws an error if the hierarchy is trivially cyclical", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a", parent: "a"};
  test.throws(function() { h([a]); }, /\bcycle\b/);
  test.end();
});

tape("hierarchyBottomUp(data) throws an error if multiple nodes have the same id", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h([{id: "foo"}, {id: "foo"}]); }, /\bduplicate\b/);
  test.end();
});

tape("hierarchyBottomUp(data) throws an error if the specified parent is not found", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h([{id: "a"}, {id: "b", parent: "c"}]); }, /\bmissing\b/);
  test.end();
});

tape("hierarchyBottomUp(data) allows the id to be undefined for leaf nodes", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {},
      b = {},
      data = [a, b],
      root = h(data),
      B = {data: b, index: 1, depth: 1},
      A = {data: a, index: 0, depth: 1},
      ROOT = {data: data, depth: 0, children: [A, B]};
  test.deepEqual(noparents(root), [ROOT, A, B]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT]);
  test.end();
});

tape("hierarchyBottomUp(data) coerces the id to a string if defined", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: {toString: function() { return "a"; }}},
      aa = {id: "aa", parent: "a"},
      data = [a, aa],
      root = h(data),
      AA = {data: aa, index: 1, id: "aa", depth: 2},
      A = {data: a, index: 0, id: "a", depth: 1, children: [AA]},
      ROOT = {data: data, depth: 0, children: [A]};
  test.deepEqual(noparents(root), [ROOT, A, AA]);
  test.deepEqual(parents(root), [undefined, ROOT, A]);
  test.end();
});

tape("hierarchyBottomUp(data) coerces the parent id to a string", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      aa = {id: "aa", parent: {toString: function() { return "a"; }}},
      data = [a, aa],
      root = h([a, aa]),
      AA = {data: aa, index: 1, id: "aa", depth: 2},
      A = {data: a, index: 0, id: "a", depth: 1, children: [AA]},
      ROOT = {data: data, depth: 0, children: [A]};
  test.deepEqual(noparents(root), [ROOT, A, AA]);
  test.deepEqual(parents(root), [undefined, ROOT, A]);
  test.end();
});

tape("hierarchyBottomUp.id(id) observes the specified id function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchyBottomUp().id(foo),
      a = {foo: "a"},
      aa = {foo: "aa", parent: "a"},
      ab = {foo: "ab", parent: "a"},
      ac = {foo: "ac", parent: "a"},
      ad = {foo: "ad", parent: "a"},
      b = {foo: "b"},
      data = [ab, ac, a, ad, b, aa],
      root = h(data),
      B = {data: b, index: 4, id: "b", depth: 1},
      AD = {data: ad, index: 3, id: "ad", depth: 2},
      AC = {data: ac, index: 1, id: "ac", depth: 2},
      AB = {data: ab, index: 0, id: "ab", depth: 2},
      AA = {data: aa, index: 5, id: "aa", depth: 2},
      A = {data: a, index: 2, id: "a", depth: 1, children: [AB, AC, AD, AA]},
      ROOT = {data: data, depth: 0, children: [A, B]};
  test.equal(h.id(), foo);
  test.deepEqual(noparents(root), [ROOT, A, B, AB, AC, AD, AA]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT, A, A, A, A]);
  test.end();
});

tape("hierarchyBottomUp.id(id) tests that id is a function", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h.id(42); });
  test.throws(function() { h.id(null); });
  test.end();
});

tape("hierarchyBottomUp.parentId(id) observes the specified parent id function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchyBottomUp().parentId(foo),
      a = {id: "a"},
      aa = {id: "aa", foo: "a"},
      ab = {id: "ab", foo: "a"},
      ac = {id: "ac", foo: "a"},
      ad = {id: "ad", foo: "a"},
      b = {id: "b"},
      data = [ab, ac, a, ad, b, aa],
      root = h(data),
      B = {data: b, index: 4, id: "b", depth: 1},
      AD = {data: ad, index: 3, id: "ad", depth: 2},
      AC = {data: ac, index: 1, id: "ac", depth: 2},
      AB = {data: ab, index: 0, id: "ab", depth: 2},
      AA = {data: aa, index: 5, id: "aa", depth: 2},
      A = {data: a, index: 2, id: "a", depth: 1, children: [AB, AC, AD, AA]},
      ROOT = {data: data, depth: 0, children: [A, B]};
  test.equal(h.parentId(), foo);
  test.deepEqual(noparents(root), [ROOT, A, B, AB, AC, AD, AA]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT, A, A, A, A]);
  test.end();
});

tape("hierarchyBottomUp.parentId(id) tests that id is a function", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h.parentId(42); });
  test.throws(function() { h.parentId(null); });
  test.end();
});
