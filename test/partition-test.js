var tape = require("tape"),
    hierarchy = require("../");

tape("partition() has the expected defaults", function(test) {
  var p = hierarchy.partition();
  test.ok(p.sort()({value: 2}, {value: 0}) < 0);
  test.ok(p.sort()({value: -1}, {value: 2}) > 0);
  test.deepEqual(p.children()({children: [1, 2]}), [1, 2]);
  test.equal(p.value()({value: 42}), 42);
  test.deepEqual(p.size(), [1, 1]);
  test.end();
});

tape("partition(root) ignores nodes with zero value", function(test) {
  var root = {children: [{value: 1}, {value: 0}, {value: 2}, {children: [{value: 0}, {value: 0}]}]},
      p = hierarchy.partition().size([3, 3]),
      n = p.nodes(root);
  test.deepEqual(n.map(position), [[0, 0], [2, 1], [3, 1], [0, 1], [3, 1], [3, 2], [3, 2]]);
  test.deepEqual(n.map(size),     [[3, 1], [1, 1], [0, 1], [2, 1], [0, 1], [0, 1], [0, 1]]);
  test.end();
});

tape("partition(root) can handle an empty children array", function(test) {
  var p = hierarchy.partition(),
      n1 = p.nodes({children: []}),
      n2 = p.nodes({children: [{children: []}, {value: 1}]});
  test.deepEqual(n1.map(position), [[0.0, 0.0]]);
  test.deepEqual(n1.map(size),     [[1.0, 1.0]]);
  test.deepEqual(n2.map(position), [[0.0, 0.0], [1.0, 0.5], [0.0, 0.5]]);
  test.deepEqual(n2.map(size),     [[1.0, 0.5], [0.0, 0.5], [1.0, 0.5]]);
  test.end();
});

function position(node) {
  return [node.x, node.y];
}

function size(node) {
  return [node.dx, node.dy];
}
