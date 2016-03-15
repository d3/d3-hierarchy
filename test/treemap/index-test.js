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

tape("treemap.size(size) observes the specified size", function(test) {
  var t = d3_hierarchy.treemap().size([6, 4]),
      root = {id: "_"},
      a = {id: "a", parent: "_", value: 6},
      b = {id: "b", parent: "_", value: 6},
      c = {id: "c", parent: "_", value: 4},
      d = {id: "d", parent: "_", value: 3},
      e = {id: "e", parent: "_", value: 2},
      f = {id: "f", parent: "_", value: 2},
      g = {id: "g", parent: "_", value: 1},
      nodes = t([root, a, b, c, d, e, f, g]).map(position);
  test.deepEqual(t.size(), [6, 4]);
  test.deepEqual(nodes, [
    {id: "_", x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {id: "a", x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {id: "b", x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {id: "c", x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {id: "d", x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {id: "e", x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {id: "f", x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {id: "g", x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.size(size) coerces the specified size to numbers", function(test) {
  var t = d3_hierarchy.treemap().size(["6", {valueOf: function() { return 4; }}]);
  test.strictEqual(t.size()[0], 6);
  test.strictEqual(t.size()[1], 4);
  test.end();
});

tape("treemap.size(size) makes defensive copies", function(test) {
  var size = [6, 4],
      t = d3_hierarchy.treemap().size(size),
      root = {id: "_"},
      a = {id: "a", parent: "_", value: 6},
      b = {id: "b", parent: "_", value: 6},
      c = {id: "c", parent: "_", value: 4},
      d = {id: "d", parent: "_", value: 3},
      e = {id: "e", parent: "_", value: 2},
      f = {id: "f", parent: "_", value: 2},
      g = {id: "g", parent: "_", value: 1},
      nodes = (size[1] = 100, t([root, a, b, c, d, e, f, g]).map(position));
  test.deepEqual(t.size(), [6, 4]);
  t.size()[1] = 100;
  test.deepEqual(t.size(), [6, 4]);
  test.deepEqual(nodes, [
    {id: "_", x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {id: "a", x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {id: "b", x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {id: "c", x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {id: "d", x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {id: "e", x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {id: "f", x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {id: "g", x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

tape("treemap.tile(tile) observes the specified tile function", function(test) {
  var t = d3_hierarchy.treemap().size([6, 4]).tile(d3_hierarchy.treemapSlice),
      root = {id: "_"},
      a = {id: "a", parent: "_", value: 6},
      b = {id: "b", parent: "_", value: 6},
      c = {id: "c", parent: "_", value: 4},
      d = {id: "d", parent: "_", value: 3},
      e = {id: "e", parent: "_", value: 2},
      f = {id: "f", parent: "_", value: 2},
      g = {id: "g", parent: "_", value: 1},
      nodes = t([root, a, b, c, d, e, f, g]).map(position);
  test.equal(t.tile(), d3_hierarchy.treemapSlice);
  test.deepEqual(t.size(), [6, 4]);
  test.deepEqual(nodes, [
    {id: "_", x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {id: "a", x0: 0.00, x1: 6.00, y0: 0.00, y1: 1.00},
    {id: "b", x0: 0.00, x1: 6.00, y0: 1.00, y1: 2.00},
    {id: "c", x0: 0.00, x1: 6.00, y0: 2.00, y1: 2.67},
    {id: "d", x0: 0.00, x1: 6.00, y0: 2.67, y1: 3.17},
    {id: "e", x0: 0.00, x1: 6.00, y0: 3.17, y1: 3.50},
    {id: "f", x0: 0.00, x1: 6.00, y0: 3.50, y1: 3.83},
    {id: "g", x0: 0.00, x1: 6.00, y0: 3.83, y1: 4.00}
  ]);
  test.end();
});

function position(d) {
  return {
    id: d.id,
    x0: round(d.x0),
    y0: round(d.y0),
    x1: round(d.x1),
    y1: round(d.y1)
  };
}

function round(x) {
  return Math.round(x * 100) / 100;
}
