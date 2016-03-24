import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";

export default function node(data) {
  var root = new Node(data),
      node = root,
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

function Node(data) {
  this.data = data;
  this.depth = 0;
  this.parent = null;
}

Node.prototype = node.prototype = {
  constructor: Node,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves
};
