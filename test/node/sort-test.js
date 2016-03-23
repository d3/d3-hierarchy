
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
