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

tape("hierarchyBottomUp(data) returns the root node", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      aa = {id: "aa", parent: "a"},
      ab = {id: "ab", parent: "a"},
      aaa = {id: "aaa", parent: "aa"},
      data = [a, aa, ab, aaa],
      root = h(data),
      AAA = {data: aaa, index: 3, id: "aaa", depth: 2},
      AB = {data: ab, index: 2, id: "ab", depth: 1},
      AA = {data: aa, index: 1, id: "aa", depth: 1, children: [AAA]},
      A = {data: a, index: 0, id: "a", depth: 0, children: [AA, AB]};
  test.ok(root instanceof d3_hierarchy.hierarchyNode);
  test.deepEqual(noparents(root), [A, AA, AB, AAA]);
  test.deepEqual(parents(root), [undefined, A, A, AA]);
  test.end();
});

tape("hierarchyBottomUp(data) does not require the data to be in topological order", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      aa = {id: "aa", parent: "a"},
      data = [aa, a],
      root = h(data),
      AA = {data: aa, index: 0, id: "aa", depth: 1},
      A = {data: a, index: 1, id: "a", depth: 0, children: [AA]};
  test.deepEqual(noparents(root), [A, AA]);
  test.deepEqual(parents(root), [undefined, A]);
  test.end();
});

tape("hierarchyBottomUp(data) throws an error if the data does not have a single root", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h([{id: "a"}, {id: "b"}]); }, /\bmultiple roots\b/);
  test.end();
});

tape("hierarchyBottomUp(data) throws an error if the hierarchy is cyclical", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h([{id: "a", parent: "a"}]); }, /\bcycle\b/);
  test.throws(function() { h([{id: "a", parent: "b"}, {id: "b", parent: "a"}]); }, /\bcycle\b/);
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
      a = {id: "a"},
      aa = {parent: "a"},
      ab = {parent: "a"},
      data = [a, aa, ab],
      root = h(data),
      AB = {data: ab, index: 2, depth: 1},
      AA = {data: aa, index: 1, depth: 1},
      A = {data: a, index: 0, id: "a", depth: 0, children: [AA, AB]};
  test.deepEqual(noparents(root), [A, AA, AB]);
  test.deepEqual(parents(root), [undefined, A, A]);
  test.end();
});

tape("hierarchyBottomUp(data) coerces the id to a string if defined", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: {toString: function() { return "a"; }}},
      aa = {id: "aa", parent: "a"},
      data = [a, aa],
      root = h(data),
      AA = {data: aa, index: 1, id: "aa", depth: 1},
      A = {data: a, index: 0, id: "a", depth: 0, children: [AA]};
  test.deepEqual(noparents(root), [A, AA]);
  test.deepEqual(parents(root), [undefined, A]);
  test.end();
});

tape("hierarchyBottomUp(data) coerces the parent id to a string", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp(),
      a = {id: "a"},
      aa = {id: "aa", parent: {toString: function() { return "a"; }}},
      data = [a, aa],
      root = h([a, aa]),
      AA = {data: aa, index: 1, id: "aa", depth: 1},
      A = {data: a, index: 0, id: "a", depth: 0, children: [AA]};
  test.deepEqual(noparents(root), [A, AA]);
  test.deepEqual(parents(root), [undefined, A]);
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
      data = [ab, ac, a, ad, aa],
      root = h(data),
      AD = {data: ad, index: 3, id: "ad", depth: 1},
      AC = {data: ac, index: 1, id: "ac", depth: 1},
      AB = {data: ab, index: 0, id: "ab", depth: 1},
      AA = {data: aa, index: 4, id: "aa", depth: 1},
      A = {data: a, index: 2, id: "a", depth: 0, children: [AB, AC, AD, AA]};
  test.equal(h.id(), foo);
  test.deepEqual(noparents(root), [A, AB, AC, AD, AA]);
  test.deepEqual(parents(root), [undefined, A, A, A, A]);
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
      data = [ab, ac, a, ad, aa],
      root = h(data),
      AD = {data: ad, index: 3, id: "ad", depth: 1},
      AC = {data: ac, index: 1, id: "ac", depth: 1},
      AB = {data: ab, index: 0, id: "ab", depth: 1},
      AA = {data: aa, index: 4, id: "aa", depth: 1},
      A = {data: a, index: 2, id: "a", depth: 0, children: [AB, AC, AD, AA]};
  test.equal(h.parentId(), foo);
  test.deepEqual(noparents(root), [A, AB, AC, AD, AA]);
  test.deepEqual(parents(root), [undefined, A, A, A, A]);
  test.end();
});

tape("hierarchyBottomUp.parentId(id) tests that id is a function", function(test) {
  var h = d3_hierarchy.hierarchyBottomUp();
  test.throws(function() { h.parentId(42); });
  test.throws(function() { h.parentId(null); });
  test.end();
});
