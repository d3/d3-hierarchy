var tape = require("tape"),
    d3 = require("../../");

tape("d3.hierarchy(data, children) supports iterable children", function(test) {
  var root = d3.hierarchy({id: "root", children: new Set([{id: "a"}, {id: "b", children: new Set([{id: "ba"}])}])}),
      a = root.children[0],
      b = root.children[1],
      ba = root.children[1].children[0];
  test.deepEqual(root.links(), [
    {source: root, target: a},
    {source: root, target: b},
    {source: b, target: ba}
  ]);
  test.end();
});

tape("d3.hierarchy(data, children) ignores non-iterable children", function(test) {
  var root = d3.hierarchy({id: "root", children: [{id: "a", children: null}, {id: "b", children: 42}]}),
      a = root.children[0],
      b = root.children[1];
  test.deepEqual(root.links(), [
    {source: root, target: a},
    {source: root, target: b}
  ]);
  test.end();
});
