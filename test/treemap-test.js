var tape = require("tape"),
    hierarchy = require("../");

tape("treemap() has the expected defaults", function(test) {
  var t = hierarchy.treemap();
  test.deepEqual(t.size(), [1, 1]);
  test.equal(t.padding(), null);
  test.equal(t.round(), false);
  test.equal(t.sticky(), false);
  test.equal(t.ratio(), (1 + Math.sqrt(5)) / 2);
  test.equal(t.mode(), "squarify");
  test.end();
});
