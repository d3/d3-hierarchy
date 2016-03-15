var tape = require("tape"),
    d3_hierarchy = require("../../");

tape("treemapSlice(parent, x0, y0, x1, y1) generates a sliced layout", function(test) {
  var slice = d3_hierarchy.treemapSlice,
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
  slice(root, 0, 0, 6, 4);
  test.deepEqual(root.children.map(position), [
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
