var tape = require("tape")
    d3_hierarchy = require("../../");

tape("node.revalue(value) invokes the value function for each descendant in post-traversal order", function(test) {
  var foo = function(d) { return d.foo; },
      root = d3_hierarchy.hierarchyTopDown().value(null).sort(null)({children: [{foo: 1}, {foo: 2}, {foo: 3}]}),
      results = [];
  root.revalue(function(d, i, data) { results.push([this, d, i, data]); });
  test.deepEqual(results, [
    [root.children[0], root.children[0].data, undefined, root.data],
    [root.children[1], root.children[1].data, undefined, root.data],
    [root.children[2], root.children[2].data, undefined, root.data],
    [root, root.data, undefined, root.data]
  ]);
  test.end();
});

tape("node.revalue(value) coerces each returned value to a number", function(test) {
  var root = d3_hierarchy.hierarchyTopDown()
      .value(null)
      .sort(null)
      ({children: [{value: "1"}, {value: {valueOf: function() { return 2; }}}]})
      .revalue(function(d) { return d.value; });
  test.strictEqual(root.value, 3);
  test.strictEqual(root.children[0].value, 1);
  test.strictEqual(root.children[1].value, 2);
  test.end();
});

tape("node.revalue(value) treats NaN values as zero", function(test) {
  var root = d3_hierarchy.hierarchyTopDown()
      .value(null)
      .sort(null)
      ({children: [{value: NaN}, {}, {value: "foo"}]})
      .revalue(function(d) { return d.value; });
  test.strictEqual(root.value, 0);
  test.strictEqual(root.children[0].value, 0);
  test.strictEqual(root.children[1].value, 0);
  test.strictEqual(root.children[2].value, 0);
  test.end();
});

tape("node.revalue(value) aggregates values from the leaves and internal nodes", function(test) {
  var root = d3_hierarchy.hierarchyTopDown()
      .value(null)
      .sort(null)
      ({value: 1, children: [{value: 2}, {value: 3}]})
      .revalue(function(d) { return d.value; });
  test.strictEqual(root.value, 6);
  test.strictEqual(root.children[0].value, 2);
  test.strictEqual(root.children[1].value, 3);
  test.end();
});
