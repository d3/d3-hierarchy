import node_each from "./each";
import node_eachBefore from "./eachBefore";
import node_eachAfter from "./eachAfter";
import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";

export default function node(data) {
  var root = new Node(data),
      node,
      nodes = [root],
      child,
      children,
      i,
      n;

  while ((node = nodes.pop()) != null) {
    if ((children = node.data.children) && (n = children.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(children[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root;
}

function node_copy() {
  return node(this).eachBefore(function(node) {
    node.data = node.data.data;
  });
}

function Node(data) {
  this.data = data;
  this.depth = 0;
  this.parent = null;
}

Node.prototype = node.prototype = {
  constructor: Node,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  copy: node_copy
};
