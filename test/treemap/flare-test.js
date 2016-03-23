var fs = require("fs"),
    tape = require("tape"),
    d3_queue = require("d3-queue"),
    d3_dsv = require("d3-dsv"),
    d3_hierarchy = require("../../");

tape("treemap(flare) produces the expected result with a squarified ratio of φ", test(
  "test/data/flare.csv",
  "test/data/flare-phi.json",
  d3_hierarchy.treemapSquarify
));

tape("treemap(flare) produces the expected result with a squarified ratio of 1", test(
  "test/data/flare.csv",
  "test/data/flare-one.json",
  d3_hierarchy.treemapSquarify.ratio(1)
));

function test(input, expected, tile) {
  return function(test) {

    d3_queue.queue()
        .defer(fs.readFile, input, "utf8")
        .defer(fs.readFile, expected, "utf8")
        .await(ready);

    function ready(error, inputText, expectedText) {
      if (error) throw error;

      var data = d3_dsv.csvParse(inputText),
          expected = JSON.parse(expectedText);

      var actual = d3_hierarchy.hierarchyBottomUp()
          .parentId(function(d) { var i = d.id.lastIndexOf("."); return i >= 0 ? d.id.slice(0, i) : null; })
          .sort(function(a, b) { return b.value - a.value || a.id.localeCompare(b.id); })
        (data)
        .children[0];

      var treemap = d3_hierarchy.treemap()
          .tile(tile)
          .size([960, 500]);

      treemap(actual);

      (function visit(node) {
        node.name = node.id.slice(node.id.lastIndexOf(".") + 1);
        node.x = round(node.x0);
        node.y = round(node.y0);
        node.dx = round(node.x1 - node.x0);
        node.dy = round(node.y1 - node.y0);
        --node.depth;
        delete node.index;
        delete node.id;
        delete node.parent;
        delete node._squarify;
        delete node.data;
        delete node.x0;
        delete node.y0;
        delete node.x1;
        delete node.y1;
        if (node.children) node.children.forEach(visit);
      })(actual);

      (function visit(node) {
        node.x = round(node.x);
        node.y = round(node.y);
        node.dx = round(node.dx);
        node.dy = round(node.dy);
        if (node.children) {
          node.children.reverse(); // D3 3.x bug
          node.children.forEach(visit);
        }
      })(expected);

      test.deepEqual(actual, expected);
      test.end();
    }
  };
}

function round(x) {
  return Math.round(x * 100) / 100;
}
