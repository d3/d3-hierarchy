import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";
import visitBefore from "../visitBefore";

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
  var root = node(this);
  visitBefore(root, function(node) {
    node.data = node.data.data;
  });
  return root;
}

function Node(data) {
  this.data = data;
  this.depth = 0;
  this.parent = null;
}

Node.prototype = node.prototype = {
  constructor: Node,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  copy: node_copy
};
