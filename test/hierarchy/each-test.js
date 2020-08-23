var tape = require("tape"),
    d3 = require("../../");

var tree = {id: "root", children: [{id: "a", children: [{id: "ab"}]}, {id: "b", children: [{id: "ba"}]}]};

tape("node.each() traverses a hierarchy in breadth-first order", function(test) {
  var root = d3.hierarchy(tree);
  
  var a = [];
  root.each(function(d) { a.push(d.data.id); });
  test.deepEqual(a, [ 'root', 'a', 'b', 'ab', 'ba' ]);
  test.end();
});

tape("node.eachBefore() traverses a hierarchy in pre-order traversal", function(test) {
  var root = d3.hierarchy(tree);
  
  var a = [];
  root.eachBefore(function(d) { a.push(d.data.id); });
  test.deepEqual(a, [ 'root', 'a', 'ab', 'b', 'ba' ]);
  test.end();
});

tape("node.eachAfter() traverses a hierarchy in post-order traversal", function(test) {
  var root = d3.hierarchy(tree);
  
  var a = [];
  root.eachAfter(function(d) { a.push(d.data.id); });
  test.deepEqual(a, [ 'ab', 'a', 'ba', 'b', 'root' ]);
  test.end();
});

tape("a hierarchy is an iterable equivalent to *node*.each()", function(test) {
  var root = d3.hierarchy(tree);
  
  var a = [];
  for (var d of root) a.push(d.data.id);
  test.deepEqual(a, [ 'root', 'a', 'b', 'ab', 'ba' ]);
  test.end();
});

