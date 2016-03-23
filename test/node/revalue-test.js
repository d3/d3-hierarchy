var tape = require("tape")
    d3_hierarchy = require("../../");

tape("node.revalue(value) invokes the value function for each descendant in post-traversal order", function(test) {
  var foo = function(d) { return d.foo; },
      root = d3_hierarchy.hierarchyTopDown()({children: [{foo: 1}, {foo: 2}, {foo: 3}]}),
      results = [];
  test.equal(root.revalue(function(d) { results.push(d); }), root);
  test.deepEqual(results, [
    root.children[0].data,
    root.children[1].data,
    root.children[2].data,
    root.data
  ]);
  test.end();
});

tape("node.revalue(value) coerces each returned value to a number", function(test) {
  var root = d3_hierarchy.hierarchyTopDown()({children: [{value: "1"}, {value: {valueOf: function() { return 2; }}}]});
  test.equal(root.revalue(function(d) { return d.value; }), root);
  test.strictEqual(root.value, 3);
  test.strictEqual(root.children[0].value, 1);
  test.strictEqual(root.children[1].value, 2);
  test.end();
});

tape("node.revalue(value) treats NaN values as zero", function(test) {
  var root = d3_hierarchy.hierarchyTopDown()({children: [{value: NaN}, {}, {value: "foo"}]});
  test.equal(root.revalue(function(d) { return d.value; }), root);
  test.strictEqual(root.value, 0);
  test.strictEqual(root.children[0].value, 0);
  test.strictEqual(root.children[1].value, 0);
  test.strictEqual(root.children[2].value, 0);
  test.end();
});

tape("node.revalue(value) aggregates values from the leaves and internal nodes", function(test) {
  var root = d3_hierarchy.hierarchyTopDown()({value: 1, children: [{value: 2}, {value: 3}]});
  test.equal(root.revalue(function(d) { return d.value; }), root);
  test.strictEqual(root.value, 6);
  test.strictEqual(root.children[0].value, 2);
  test.strictEqual(root.children[1].value, 3);
  test.end();
});
