var tape = require("tape"),
    d3_hierarchy = require("../../"),
    round = require("./round"),
    simple = require("../data/simple2");

tape("treemap() has the expected defaults", function(test) {
  var treemap = d3_hierarchy.treemap();
  test.equal(treemap.value()({value: 42}), 42);
  test.ok(treemap.sort()({value: 1}, {value: 2}) > 0);
  test.ok(treemap.sort()({value: 2}, {value: 1}) < 0);
  test.equal(treemap.sort()({value: 1}, {value: 1}), 0);
  test.equal(treemap.tile(), d3_hierarchy.treemapSquarify);
  test.deepEqual(treemap.size(), [1, 1]);
  test.deepEqual(treemap.round(), false);
  test.end();
});

tape("treemap.round(round) observes the specified rounding", function(test) {
  var treemap = d3_hierarchy.treemap().size([600, 400]).round(true),
      root = treemap(simple),
      nodes = root.descendants().map(round);
  test.deepEqual(treemap.round(), true);
  test.deepEqual(nodes, [
    {x0:   0, x1: 600, y0:   0, y1: 400},
    {x0:   0, x1: 300, y0:   0, y1: 200},
    {x0:   0, x1: 300, y0: 200, y1: 400},
    {x0: 300, x1: 471, y0:   0, y1: 233},
    {x0: 471, x1: 600, y0:   0, y1: 233},
    {x0: 300, x1: 540, y0: 233, y1: 317},
    {x0: 300, x1: 540, y0: 317, y1: 400},
    {x0: 540, x1: 600, y0: 233, y1: 400}
  ]);
  test.end();
});

tape("treemap.round(round) coerces the specified round to boolean", function(test) {
  var treemap = d3_hierarchy.treemap().round("yes");
  test.strictEqual(treemap.round(), true);
  test.end();
});

tape("treemap.padding(padding) sets the inner and outer padding to the specified value", function(test) {
  var treemap = d3_hierarchy.treemap().padding("42");
  test.deepEqual(treemap.padding(), [42, 42, 42, 42]);
  test.deepEqual(treemap.paddingInner(), [42, 42, 42, 42]);
  test.deepEqual(treemap.paddingOuter(), [42, 42, 42, 42]);
  test.end();
});

tape("treemap.paddingInner(padding) observes the specified padding", function(test) {
  var treemap = d3_hierarchy.treemap().size([6, 4]).paddingInner(0.5),
      root = treemap(simple),
      nodes = root.descendants().map(round);
  test.deepEqual(treemap.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 2.75, y0: 0.00, y1: 1.75},
    {x0: 0.00, x1: 2.75, y0: 2.25, y1: 4.00},
    {x0: 3.25, x1: 4.61, y0: 0.00, y1: 2.13},
    {x0: 5.11, x1: 6.00, y0: 0.00, y1: 2.13},
    {x0: 3.25, x1: 5.35, y0: 2.63, y1: 3.06},
    {x0: 3.25, x1: 5.35, y0: 3.56, y1: 4.00},
    {x0: 5.85, x1: 6.00, y0: 2.63, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.paddingOuter(padding) observes the specified padding", function(test) {
  var treemap = d3_hierarchy.treemap().size([6, 4]).paddingOuter(0.5),
      root = treemap(simple),
      nodes = root.descendants().map(round);
  test.deepEqual(treemap.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.50, x1: 3.00, y0: 0.50, y1: 2.00},
    {x0: 0.50, x1: 3.00, y0: 2.00, y1: 3.50},
    {x0: 3.00, x1: 4.43, y0: 0.50, y1: 2.25},
    {x0: 4.43, x1: 5.50, y0: 0.50, y1: 2.25},
    {x0: 3.00, x1: 5.00, y0: 2.25, y1: 2.88},
    {x0: 3.00, x1: 5.00, y0: 2.88, y1: 3.50},
    {x0: 5.00, x1: 5.50, y0: 2.25, y1: 3.50}
  ]);
  test.end();
});

tape("treemap.size(size) observes the specified size", function(test) {
  var treemap = d3_hierarchy.treemap().size([6, 4]),
      root = treemap(simple),
      nodes = root.descendants().map(round);
  test.deepEqual(treemap.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.size(size) coerces the specified size to numbers", function(test) {
  var treemap = d3_hierarchy.treemap().size(["6", {valueOf: function() { return 4; }}]);
  test.strictEqual(treemap.size()[0], 6);
  test.strictEqual(treemap.size()[1], 4);
  test.end();
});

tape("treemap.size(size) makes defensive copies", function(test) {
  var size = [6, 4],
      treemap = d3_hierarchy.treemap().size(size),
      root = (size[1] = 100, treemap(simple)),
      nodes = root.descendants().map(round);
  test.deepEqual(treemap.size(), [6, 4]);
  treemap.size()[1] = 100;
  test.deepEqual(treemap.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.tile(tile) observes the specified tile function", function(test) {
  var treemap = d3_hierarchy.treemap().size([6, 4]).tile(d3_hierarchy.treemapSlice),
      root = treemap(simple),
      nodes = root.descendants().map(round);
  test.equal(treemap.tile(), d3_hierarchy.treemapSlice);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 1.00},
    {x0: 0.00, x1: 6.00, y0: 1.00, y1: 2.00},
    {x0: 0.00, x1: 6.00, y0: 2.00, y1: 2.67},
    {x0: 0.00, x1: 6.00, y0: 2.67, y1: 3.17},
    {x0: 0.00, x1: 6.00, y0: 3.17, y1: 3.50},
    {x0: 0.00, x1: 6.00, y0: 3.50, y1: 3.83},
    {x0: 0.00, x1: 6.00, y0: 3.83, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.value(value)(data) observes the specified value function", function(test) {
  var foo = function(d) { return d.foo; },
      treemap = d3_hierarchy.treemap().value(foo).size([6, 4]),
      root = treemap(require("../data/simple3")),
      nodes = root.descendants().map(round);
  test.equal(treemap.value(), foo);
  test.deepEqual(treemap.size(), [6, 4]);
  test.deepEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.value(value) throws an error if value is not a function", function(test) {
  var treemap = d3_hierarchy.treemap();
  test.throws(function() { t.value(42); });
  test.throws(function() { t.value(null); });
  test.end();
});

tape("treemap.value(value) invokes the value function for each descendant in post-traversal order", function(test) {
  var results = [],
      root = d3_hierarchy.treemap().sort(null).value(function(d) { results.push(d); })({children: [{value: 1}, {value: 2}, {value: 3}]});
  test.deepEqual(results, [
    root.children[0].data,
    root.children[1].data,
    root.children[2].data,
    root.data
  ]);
  test.end();
});

tape("treemap.value(value) coerces each returned value to a number", function(test) {
  var root = d3_hierarchy.treemap().sort(null)({children: [{value: "1"}, {value: {valueOf: function() { return 2; }}}]});
  test.strictEqual(root.value, 3);
  test.strictEqual(root.children[0].value, 1);
  test.strictEqual(root.children[1].value, 2);
  test.end();
});

tape("treemap.value(value) treats NaN values as zero", function(test) {
  var root = d3_hierarchy.treemap().sort(null)({children: [{value: NaN}, {}, {value: "foo"}]});
  test.strictEqual(root.value, 0);
  test.strictEqual(root.children[0].value, 0);
  test.strictEqual(root.children[1].value, 0);
  test.strictEqual(root.children[2].value, 0);
  test.end();
});

tape("treemap.value(value) aggregates values from the leaves and internal nodes", function(test) {
  var root = d3_hierarchy.treemap().sort(null)({value: 1, children: [{value: 2}, {value: 3}]});
  test.strictEqual(root.value, 6);
  test.strictEqual(root.children[0].value, 2);
  test.strictEqual(root.children[1].value, 3);
  test.end();
});

tape("treemap.sort(sort) sorts siblings according to the specified comparator", function(test) {
  var ascendingValue = function(a, b) { return a.value - b.value; },
      treemap = d3_hierarchy.treemap().sort(ascendingValue),
      root = treemap(simple);
  test.equal(treemap.sort(), ascendingValue);
  test.deepEqual(root.descendants().map(function(d) { return d.value; }), [24, 1, 2, 2, 3, 4, 6, 6]);
  test.end();
});
