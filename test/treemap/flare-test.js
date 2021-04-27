import assert from "assert";
import * as d3 from "../../src/index.js";
import * as d3_dsv from "d3-dsv";
import {readFileSync} from "fs";

it("treemap(flare) produces the expected result with a squarified ratio of φ", test(
  "test/data/flare.csv",
  "test/data/flare-phi.json",
  d3.treemapSquarify
));

it("treemap(flare) produces the expected result with a squarified ratio of 1", test(
  "test/data/flare.csv",
  "test/data/flare-one.json",
  d3.treemapSquarify.ratio(1)
));

function test(inputFile, expectedFile, tile) {
  return () => {
    const inputText = readFileSync(inputFile, "utf8"),
        expectedText = readFileSync(expectedFile, "utf8");

    const stratify = d3.stratify()
        .parentId(function(d) { const i = d.id.lastIndexOf("."); return i >= 0 ? d.id.slice(0, i) : null; });

    const treemap = d3.treemap()
        .tile(tile)
        .size([960, 500]);

    const data = d3_dsv.csvParse(inputText),
        expected = JSON.parse(expectedText),
        actual = treemap(stratify(data)
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value || a.data.id.localeCompare(b.data.id); }));

    (function visit(node) {
      node.name = node.data.id.slice(node.data.id.lastIndexOf(".") + 1);
      node.x0 = round(node.x0);
      node.y0 = round(node.y0);
      node.x1 = round(node.x1);
      node.y1 = round(node.y1);
      delete node.id;
      delete node.parent;
      delete node.data;
      delete node._squarify;
      delete node.height;
      if (node.children) node.children.forEach(visit);
    })(actual);

    (function visit(node) {
      node.x0 = round(node.x);
      node.y0 = round(node.y);
      node.x1 = round(node.x + node.dx);
      node.y1 = round(node.y + node.dy);
      delete node.x;
      delete node.y;
      delete node.dx;
      delete node.dy;
      if (node.children) {
        node.children.reverse(); // D3 3.x bug
        node.children.forEach(visit);
      }
    })(expected);

    assert.deepStrictEqual(actual, expected);
}
}

function round(x) {
  return Math.round(x * 100) / 100;
}
