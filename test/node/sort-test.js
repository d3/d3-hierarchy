var tape = require("tape")
    d3_hierarchy = require("../../"),
    noparent = require("../hierarchy/noparent"),
    simple = require("../data/simple");

tape("node.sort(sort) sorts siblings according to the specified comparator", function(test) {
  var value = function(d) { return d.value; },
      descendingValue = function(a, b) { return b.value - a.value; },
      root = d3_hierarchy.hierarchyTopDown()(simple).revalue(value);
  test.equal(root.sort(descendingValue), root);
  test.deepEqual(root.descendants().map(function(d) { return d.value; }), [15, 9, 6, 4, 3, 2, 3, 2, 1]);
  test.end();
});
