var tape = require("tape"),
    d3 = require("../../");

tape("node.find() finds nodes", function(test) {
  var root = d3.hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}).count();
  
  test.equal(root.find(function(d) { return d.data.id == "b"; }).data.id, "b");
  test.equal(root.find(function(d, i) { return i == 0; }).data.id, "root");
  test.equal(root.find(function(d, i, e) { return d !== e; }).data.id, "a");
  test.end();
});
