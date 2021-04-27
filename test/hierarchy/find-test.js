import assert from "assert";
import * as d3 from "../../src/index.js";

it("node.find() finds nodes", () => {
  const root = d3.hierarchy({id: "root", children: [{id: "a"}, {id: "b", children: [{id: "ba"}]}]}).count();
  
  assert.strictEqual(root.find(function(d) { return d.data.id == "b"; }).data.id, "b");
  assert.strictEqual(root.find(function(d, i) { return i == 0; }).data.id, "root");
  assert.strictEqual(root.find(function(d, i, e) { return d !== e; }).data.id, "a");
});
