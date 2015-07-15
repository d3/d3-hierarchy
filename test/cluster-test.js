var tape = require("tape"),
    hierarchy = require("../");

tape("cluster() has the expected defaults", function(test) {
  var c = hierarchy.cluster();
  test.equal(c.sort(), null);
  test.deepEqual(c.children()({children: [1, 2]}), [1, 2]);
  test.equal(c.value(), null);
  test.deepEqual(c.size(), [1, 1]);
  test.end();
});
