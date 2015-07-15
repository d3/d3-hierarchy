var tape = require("tape"),
    hierarchy = require("../");

tape("pack() has the expected defaults", function(test) {
  var p = hierarchy.pack();
  test.ok(p.sort()({value: 2}, {value: 0}) > 0);
  test.ok(p.sort()({value: -1}, {value: 2}) < 0);
  test.deepEqual(p.children()({children: [1, 2]}), [1, 2]);
  test.equal(p.value()({value: 42}), 42);
  test.deepEqual(p.size(), [1, 1]);
  test.end();
});
