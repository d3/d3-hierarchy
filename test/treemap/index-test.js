var tape = require("tape"),
    d3_hierarchy = require("../../");

tape("treemap() has the expected defaults", function(test) {
  var t = d3_hierarchy.treemap();
  test.equal(t.id()({id: "foo"}), "foo");
  test.equal(t.parentId()({parent: "bar"}), "bar");
  test.equal(t.value()({value: 42}), 42);
  test.ok(t.sort()({value: 1}, {value: 2}) > 0);
  test.ok(t.sort()({value: 2}, {value: 1}) < 0);
  test.equal(t.sort()({value: 1}, {value: 1}), 0);
  test.equal(t.tile(), d3_hierarchy.treemapSquarify);
  test.deepEqual(t.size(), [1, 1]);
  test.end();
});
