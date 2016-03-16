import node_each from "./each";
import node_eachAfter from "./eachAfter";
import node_eachBefore from "./eachBefore";
import node_sort from "./sort";

export default function Node() {}

Node.prototype = {
  constructor: Node,
  each: node_each,
  eachBefore: node_eachBefore,
  eachAfter: node_eachAfter,
  sort: node_sort
};
