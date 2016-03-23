var tape = require("tape"),
    d3_hierarchy = require("../../"),
    noparents = require("./noparents"),
    parents = require("./parents");

tape("hierarchyTopDown() has the expected defaults", function(test) {
  var h = d3_hierarchy.hierarchyTopDown();
  test.deepEqual(h.children()({children: [1, 2]}), [1, 2]);
  test.equal(h.value()({value: 42}), 42);
  test.ok(h.sort()({value: 1}, {value: 2}) > 0);
  test.ok(h.sort()({value: 2}, {value: 1}) < 0);
  test.equal(h.sort()({value: 1}, {value: 1}), 0);
  test.end();
});

tape("hierarchyTopDown(data) returns a root node", function(test) {
  var h = d3_hierarchy.hierarchyTopDown().value(null),
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

tape("hierarchyTopDown(data) preserves the input order of siblings", function(test) {
  var h = d3_hierarchy.hierarchyTopDown().value(null),
      b = {},
      a = {},
      c = {},
      data = {children: [b, a, c]},
      root = h(data),
      B = {data: b, depth: 1},
      A = {data: a, depth: 1},
      C = {data: c, depth: 1},
      ROOT = {data: data, depth: 0, children: [B, A, C]};
  test.deepEqual(noparents(root), [ROOT, B, A, C]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT, ROOT]);
  test.end();
});

tape("hierarchyTopDown.children(children) observes the specified children function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchyTopDown().value(null).children(foo),
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

tape("hierarchyTopDown.value(value) observes the specified value function", function(test) {
  var foo = function(d) { return d.foo; },
      h = d3_hierarchy.hierarchyTopDown().value(foo),
      b = {foo: 2},
      a = {foo: 1},
      c = {foo: 3},
      data = {children: [b, a, c]},
      root = h(data),
      B = {data: b, value: 2, depth: 1},
      A = {data: a, value: 1, depth: 1},
      C = {data: c, value: 3, depth: 1},
      ROOT = {data: data, value: 6, depth: 0, children: [C, B, A]};
  test.equal(h.value(), foo);
  test.deepEqual(noparents(root), [ROOT, C, B, A]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT, ROOT]);
  test.end();
});

tape("hierarchyTopDown.value(value) tests that value is a function or null", function(test) {
  var h = d3_hierarchy.hierarchyTopDown().value(undefined);
  test.throws(function() { h.value(42); });
  test.end();
});

tape("hierarchyTopDown.sort(sort) observes the specified sort function", function(test) {
  var foo = function(a, b) { return a.value - b.value; },
      h = d3_hierarchy.hierarchyTopDown().sort(foo),
      b = {value: 2},
      a = {value: 1},
      c = {value: 3},
      data = {children: [b, a, c]},
      root = h(data),
      B = {data: b, value: 2, depth: 1},
      A = {data: a, value: 1, depth: 1},
      C = {data: c, value: 3, depth: 1},
      ROOT = {data: data, value: 6, depth: 0, children: [A, B, C]};
  test.equal(h.sort(), foo);
  test.deepEqual(noparents(root), [ROOT, A, B, C]);
  test.deepEqual(parents(root), [undefined, ROOT, ROOT, ROOT]);
  test.end();
});

tape("hierarchyTopDown.sort(sort) tests that sort is a function or null", function(test) {
  var h = d3_hierarchy.hierarchyTopDown().sort(undefined);
  test.throws(function() { h.sort(42); });
  test.end();
});
