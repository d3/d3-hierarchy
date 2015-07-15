var tape = require("tape"),
    hierarchy = require("../");

tape("treemap() has the expected defaults", function(test) {
  var t = hierarchy.treemap();
  test.ok(t.sort()({value: 2}, {value: 0}) < 0);
  test.ok(t.sort()({value: -1}, {value: 2}) > 0);
  test.deepEqual(t.children()({children: [1, 2]}), [1, 2]);
  test.equal(t.value()({value: 42}), 42);
  test.deepEqual(t.size(), [1, 1]);
  test.equal(t.padding(), null);
  test.equal(t.round(), false);
  test.equal(t.sticky(), false);
  test.equal(t.ratio(), (1 + Math.sqrt(5)) / 2);
  test.equal(t.mode(), "squarify");
  test.end();
});
