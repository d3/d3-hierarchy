var tape = require("tape"),
    d3 = require("../../");

tape("node.copy() copies values", function(test) {
  var root = d3.hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}).count();
  test.equal(root.copy().value, 2);
  test.end();
});
