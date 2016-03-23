import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";
import node_each from "./each";
import node_eachAfter from "./eachAfter";
import node_eachBefore from "./eachBefore";
import node_evaluate from "./evaluate";
import node_sort from "./sort";

export default function Node(data) {
  this.data = data;
}

Node.prototype = {
  constructor: Node,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  evaluate: node_evaluate,
  sort: node_sort
};
