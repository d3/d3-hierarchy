var fs = require("fs"),
    tape = require("tape"),
    d3_queue = require("d3-queue"),
    d3_dsv = require("d3-dsv"),
    d3_hierarchy = require("../");

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

      var treemap = d3_hierarchy.treemap()
          .tile(tile)
          .parentId(function(d) { var i = d.id.lastIndexOf("."); return i >= 0 ? d.id.slice(0, i) : null; })
          .sort(function(a, b) { return b.value - a.value || a.id.localeCompare(b.id); })
          .size([960, 500]);

      var nodes = treemap(data);

      nodes.forEach(function(d) {
        d.name = d.id.slice(d.id.lastIndexOf(".") + 1);
        d.x = round(d.x0);
        d.y = round(d.y0);
        d.dx = round(d.x1 - d.x0);
        d.dy = round(d.y1 - d.y0);
        delete d.x0;
        delete d.y0;
        delete d.x1;
        delete d.y1;
        delete d.data;
        delete d.index;
        delete d.id;
        delete d.parent;
      });

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

      test.deepEqual(nodes[0], expected);
      test.end();
    }
  };
}

function round(x) {
  return Math.round(x * 100) / 100;
}
