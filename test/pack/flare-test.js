import assert from "assert";
import * as d3 from "../../src/index.js";
import * as d3_dsv from "d3-dsv";
import {readFileSync} from "fs";

it("pack(flare) produces the expected result", test(
  "test/data/flare.csv",
  "test/data/flare-pack.json"
));

function test(inputFile, expectedFile) {
  return () => {
    const inputText = readFileSync(inputFile, "utf8"),
        expectedText = readFileSync(expectedFile, "utf8");

    const stratify = d3.stratify()
        .parentId(function(d) { const i = d.id.lastIndexOf("."); return i >= 0 ? d.id.slice(0, i) : null; });

    const pack = d3.pack()
        .size([960, 960]);

    const data = d3_dsv.csvParse(inputText),
        expected = JSON.parse(expectedText),
        actual = pack(stratify(data)
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value || a.data.id.localeCompare(b.data.id); }));

    (function visit(node) {
      node.name = node.data.id.slice(node.data.id.lastIndexOf(".") + 1);
      node.x = round(node.x);
      node.y = round(node.y);
      node.r = round(node.r);
      delete node.id;
      delete node.parent;
      delete node.data;
      delete node.depth;
      delete node.height;
      if (node.children) node.children.forEach(visit);
    })(actual);

    (function visit(node) {
      node.x = round(node.x);
      node.y = round(node.y);
      node.r = round(node.r);
      if (node.children) node.children.forEach(visit);
    })(expected);

    assert.deepStrictEqual(actual, expected);
}
}

function round(x) {
  return Math.round(x * 100) / 100;
}
