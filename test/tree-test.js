var tape = require("tape"),
    hierarchy = require("../");

tape("tree() has the expected defaults", function(test) {
  var t = hierarchy.tree();
  test.equal(t.sort(), null);
  test.deepEqual(t.children()({children: [1, 2]}), [1, 2]);
  test.equal(t.value(), null);
  test.deepEqual(t.size(), [1, 1]);
  test.end();
});

tape("tree(root) computes a simple tree layout", function(test) {
  var root = {name: "1", children: [{name: "1-1"}, {name: "1-2"}, {name: "1-3"}]},
      t = hierarchy.tree(),
      n = t(root);
  test.deepEqual(n, [root, root.children[0], root.children[1], root.children[2]]);
  test.deepEqual(n.map(parent), [null, root, root, root]);
  test.deepEqual(n.map(depth), [0, 1, 1, 1]);
  test.deepEqual(n.map(position), [[0.5, 0], [0.16666666666666666, 1], [0.5, 1], [0.8333333333333333, 1]]);
  test.end();
});

tape("tree(root) can handle an empty children array", function(test) {
  var t = hierarchy.tree();
  test.deepEqual(t({children: []}).map(position), [[0.5, 0]]);
  test.deepEqual(t({children: [{children: []}, {children: [{}]}, {children: [{}]}]}).map(position), [[0.5, 0], [0.125, 0.5], [0.375, 0.5], [0.375, 1], [0.875, 0.5], [0.875, 1]]);
  test.end();
});

tape("tree(root) can handle a single node", function(test) {
  var t = hierarchy.tree();
  test.deepEqual(t({}).map(position), [[0.5, 0]]);
  test.end();
});

function parent(node) {
  return node.parent;
}

function depth(node) {
  return node.depth;
}

function position(node) {
  return [node.x, node.y];
}
