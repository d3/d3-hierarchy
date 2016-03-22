import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_each from "./each";
import node_eachAfter from "./eachAfter";
import node_eachBefore from "./eachBefore";
import node_sort from "./sort";

export default function Node(data, index) {
  this.data = data;
  this.index = index;
}

Node.prototype = {
  constructor: Node,
  each: node_each,
  eachBefore: node_eachBefore,
  eachAfter: node_eachAfter,
  ancestors: node_ancestors,
  descendants: node_descendants,
  sort: node_sort
};
