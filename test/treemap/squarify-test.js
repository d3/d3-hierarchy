var tape = require("tape"),
    d3_hierarchy = require("../../");

tape("treemapSquarify(parent, x0, y0, x1, y1) generates a squarified layout", function(test) {
  var squarify = d3_hierarchy.treemapSquarify,
      root = {
        value: 24,
        children: [
          {value: 6},
          {value: 6},
          {value: 4},
          {value: 3},
          {value: 2},
          {value: 2},
          {value: 1}
        ]
      };
  squarify(root, 0, 0, 6, 4);
  test.deepEqual(root.children.map(position), [
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

tape("treemapSquarify.ratio(ratio) observes the specified ratio", function(test) {
  var squarify = d3_hierarchy.treemapSquarify.ratio(1),
      root = {
        value: 24,
        children: [
          {value: 6},
          {value: 6},
          {value: 4},
          {value: 3},
          {value: 2},
          {value: 2},
          {value: 1}
        ]
      };
  squarify(root, 0, 0, 6, 4);
  test.deepEqual(root.children.map(position), [
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 4.20, y0: 2.33, y1: 4.00},
    {x0: 4.20, x1: 5.40, y0: 2.33, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
  test.end();
});

function position(d) {
  return {
    x0: round(d.x0),
    y0: round(d.y0),
    x1: round(d.x1),
    y1: round(d.y1)
  };
}

function round(x) {
  return Math.round(x * 100) / 100;
}
