import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";
import node_each from "./each";
import node_eachAfter from "./eachAfter";
import node_eachBefore from "./eachBefore";
import node_revalue from "./revalue";
import node_sort from "./sort";

export default function node(data) {
  return new Node(data);
}

function Node(data) {
  this.data = data;
}

Node.prototype = node.prototype = {
  constructor: Node,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  revalue: node_revalue,
  sort: node_sort
};
