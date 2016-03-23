
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
