var tape = require("tape"),
    d3_hierarchy = require("../../"),
    noparents = require("./noparents"),
    parents = require("./parents");

tape("hierarchyTopDown() has the expected defaults", function(test) {
  var h = d3_hierarchy.hierarchyTopDown();
  test.deepEqual(h.children()({children: [1, 2]}), [1, 2]);
  test.end();
});

tape("hierarchyTopDown(data) returns a root node", function(test) {
  var h = d3_hierarchy.hierarchyTopDown(),
      aaa = {},
      aa = {children: [aaa]},
      ab = {},
      a = {children: [aa, ab]},
      data = {children: [a]},
      root = h(data),
      AAA = {data: aaa, depth: 3},
      AB = {data: ab, depth: 2},
      AA = {data: aa, depth: 2, children: [AAA]},
      A = {data: a, depth: 1, children: [AA, AB]},
      ROOT = {data: data, depth: 0, children: [A]};
  test.deepEqual(noparents(root), [ROOT, A, AA, AB, AAA]);
  test.deepEqual(parents(root), [undefined, ROOT, A, A, AA]);
  test.end();
});

tape("hierarchyTopDown.children(children) observes the specified children function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchyTopDown().children(foo),
      b = {},
      a = {},
      c = {},
      data = {foo: [b, a, c]},
      root = h(data),
      B = {data: b, depth: 1},
      A = {data: a, depth: 1},
      C = {data: c, depth: 1},
      ROOT = {data: data, depth: 0, children: [B, A, C]};
  test.equal(h.children(), foo);
  test.deepEqual(noparents(root), [ROOT, B, A, C]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT, ROOT]);
  test.end();
});

tape("hierarchyTopDown.children(children) tests that children is a function", function(test) {
  var h = d3_hierarchy.hierarchyTopDown();
  test.throws(function() { h.children(42); });
  test.throws(function() { h.children(null); });
  test.end();
});
