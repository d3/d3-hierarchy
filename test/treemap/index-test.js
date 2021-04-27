import assert from "assert";
import * as d3 from "../../src/index.js";
import {round} from "./round.js";
import {readFileSync} from "fs";

const simple = JSON.parse(readFileSync("./test/data/simple2.json"));

it("treemap() has the expected defaults", () => {
  const treemap = d3.treemap();
  assert.strictEqual(treemap.tile(), d3.treemapSquarify);
  assert.deepStrictEqual(treemap.size(), [1, 1]);
  assert.deepStrictEqual(treemap.round(), false);
});

it("treemap.round(round) observes the specified rounding", () => {
  const treemap = d3.treemap().size([600, 400]).round(true),
      root = treemap(d3.hierarchy(simple).sum(defaultValue).sort(descendingValue)),
      nodes = root.descendants().map(round);
  assert.deepStrictEqual(treemap.round(), true);
  assert.deepStrictEqual(nodes, [
    {x0:   0, x1: 600, y0:   0, y1: 400},
    {x0:   0, x1: 300, y0:   0, y1: 200},
    {x0:   0, x1: 300, y0: 200, y1: 400},
    {x0: 300, x1: 471, y0:   0, y1: 233},
    {x0: 471, x1: 600, y0:   0, y1: 233},
    {x0: 300, x1: 540, y0: 233, y1: 317},
    {x0: 300, x1: 540, y0: 317, y1: 400},
    {x0: 540, x1: 600, y0: 233, y1: 400}
  ]);
});

it("treemap.round(round) coerces the specified round to boolean", () => {
  const treemap = d3.treemap().round("yes");
  assert.strictEqual(treemap.round(), true);
});

it("treemap.padding(padding) sets the inner and outer padding to the specified value", () => {
  const treemap = d3.treemap().padding("42");
  assert.strictEqual(treemap.padding()(), 42);
  assert.strictEqual(treemap.paddingInner()(), 42);
  assert.strictEqual(treemap.paddingOuter()(), 42);
  assert.strictEqual(treemap.paddingTop()(), 42);
  assert.strictEqual(treemap.paddingRight()(), 42);
  assert.strictEqual(treemap.paddingBottom()(), 42);
  assert.strictEqual(treemap.paddingLeft()(), 42);
});

it("treemap.paddingInner(padding) observes the specified padding", () => {
  const treemap = d3.treemap().size([6, 4]).paddingInner(0.5),
      root = treemap(d3.hierarchy(simple).sum(defaultValue).sort(descendingValue)),
      nodes = root.descendants().map(round);
  assert.strictEqual(treemap.paddingInner()(), 0.5);
  assert.deepStrictEqual(treemap.size(), [6, 4]);
  assert.deepStrictEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 2.75, y0: 0.00, y1: 1.75},
    {x0: 0.00, x1: 2.75, y0: 2.25, y1: 4.00},
    {x0: 3.25, x1: 4.61, y0: 0.00, y1: 2.13},
    {x0: 5.11, x1: 6.00, y0: 0.00, y1: 2.13},
    {x0: 3.25, x1: 5.35, y0: 2.63, y1: 3.06},
    {x0: 3.25, x1: 5.35, y0: 3.56, y1: 4.00},
    {x0: 5.85, x1: 6.00, y0: 2.63, y1: 4.00}
  ]);
});

it("treemap.paddingOuter(padding) observes the specified padding", () => {
  const treemap = d3.treemap().size([6, 4]).paddingOuter(0.5),
      root = treemap(d3.hierarchy(simple).sum(defaultValue).sort(descendingValue)),
      nodes = root.descendants().map(round);
  assert.strictEqual(treemap.paddingOuter()(), 0.5);
  assert.strictEqual(treemap.paddingTop()(), 0.5);
  assert.strictEqual(treemap.paddingRight()(), 0.5);
  assert.strictEqual(treemap.paddingBottom()(), 0.5);
  assert.strictEqual(treemap.paddingLeft()(), 0.5);
  assert.deepStrictEqual(treemap.size(), [6, 4]);
  assert.deepStrictEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.50, x1: 3.00, y0: 0.50, y1: 2.00},
    {x0: 0.50, x1: 3.00, y0: 2.00, y1: 3.50},
    {x0: 3.00, x1: 4.43, y0: 0.50, y1: 2.25},
    {x0: 4.43, x1: 5.50, y0: 0.50, y1: 2.25},
    {x0: 3.00, x1: 5.00, y0: 2.25, y1: 2.88},
    {x0: 3.00, x1: 5.00, y0: 2.88, y1: 3.50},
    {x0: 5.00, x1: 5.50, y0: 2.25, y1: 3.50}
  ]);
});

it("treemap.size(size) observes the specified size", () => {
  const treemap = d3.treemap().size([6, 4]),
      root = treemap(d3.hierarchy(simple).sum(defaultValue).sort(descendingValue)),
      nodes = root.descendants().map(round);
  assert.deepStrictEqual(treemap.size(), [6, 4]);
  assert.deepStrictEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
});

it("treemap.size(size) coerces the specified size to numbers", () => {
  const treemap = d3.treemap().size(["6", {valueOf: function() { return 4; }}]);
  assert.strictEqual(treemap.size()[0], 6);
  assert.strictEqual(treemap.size()[1], 4);
});

it("treemap.size(size) makes defensive copies", () => {
  const size = [6, 4],
      treemap = d3.treemap().size(size),
      root = (size[1] = 100, treemap(d3.hierarchy(simple).sum(defaultValue).sort(descendingValue))),
      nodes = root.descendants().map(round);
  assert.deepStrictEqual(treemap.size(), [6, 4]);
  treemap.size()[1] = 100;
  assert.deepStrictEqual(treemap.size(), [6, 4]);
  assert.deepStrictEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
});

it("treemap.tile(tile) observes the specified tile function", () => {
  const treemap = d3.treemap().size([6, 4]).tile(d3.treemapSlice),
      root = treemap(d3.hierarchy(simple).sum(defaultValue).sort(descendingValue)),
      nodes = root.descendants().map(round);
  assert.strictEqual(treemap.tile(), d3.treemapSlice);
  assert.deepStrictEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 1.00},
    {x0: 0.00, x1: 6.00, y0: 1.00, y1: 2.00},
    {x0: 0.00, x1: 6.00, y0: 2.00, y1: 2.67},
    {x0: 0.00, x1: 6.00, y0: 2.67, y1: 3.17},
    {x0: 0.00, x1: 6.00, y0: 3.17, y1: 3.50},
    {x0: 0.00, x1: 6.00, y0: 3.50, y1: 3.83},
    {x0: 0.00, x1: 6.00, y0: 3.83, y1: 4.00}
  ]);
});

it("treemap(data) observes the specified values", () => {
  const foo = function(d) { return d.foo; },
      treemap = d3.treemap().size([6, 4]),
      root = treemap(d3.hierarchy(JSON.parse(readFileSync("./test/data/simple3.json"))).sum(foo).sort(descendingValue)),
      nodes = root.descendants().map(round);
  assert.deepStrictEqual(treemap.size(), [6, 4]);
  assert.deepStrictEqual(nodes, [
    {x0: 0.00, x1: 6.00, y0: 0.00, y1: 4.00},
    {x0: 0.00, x1: 3.00, y0: 0.00, y1: 2.00},
    {x0: 0.00, x1: 3.00, y0: 2.00, y1: 4.00},
    {x0: 3.00, x1: 4.71, y0: 0.00, y1: 2.33},
    {x0: 4.71, x1: 6.00, y0: 0.00, y1: 2.33},
    {x0: 3.00, x1: 5.40, y0: 2.33, y1: 3.17},
    {x0: 3.00, x1: 5.40, y0: 3.17, y1: 4.00},
    {x0: 5.40, x1: 6.00, y0: 2.33, y1: 4.00}
  ]);
});

it("treemap(data) observes the specified sibling order", () => {
  const treemap = d3.treemap(),
      root = treemap(d3.hierarchy(simple).sum(defaultValue).sort(ascendingValue));
  assert.deepStrictEqual(root.descendants().map(function(d) { return d.value; }), [24, 1, 2, 2, 3, 4, 6, 6]);
});

function defaultValue(d) {
  return d.value;
}

function ascendingValue(a, b) {
  return a.value - b.value;
}

function descendingValue(a, b) {
  return b.value - a.value;
}
