import node_count from "./count";
import node_each from "./each";
import node_eachBefore from "./eachBefore";
import node_eachAfter from "./eachAfter";
import node_sum from "./sum";
import node_sort from "./sort";
import node_path from "./path";
import node_ancestors from "./ancestors";
import node_descendants from "./descendants";
import node_leaves from "./leaves";
import node_links from "./links";

export default function hierarchy(data, children, lengthAccessor, childAccessor) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;

  if (children == null) children = defaultChildren;
  if (lengthAccessor == null) lengthAccessor = defaultLength;
  if (childAccessor == null) childAccessor = defaultChild;

  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;
    if ((childs = children(node.data)) && (n = lengthAccessor(childs))) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childAccessor(childs, i)));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function defaultLength(d) {
  return d.length;
}

function defaultChild(d, i) {
  return d[i];
}

function copyData(node) {
  node.data = node.data.data;
}

export function computeHeight(node) {
  var height = 0;
  do node.height = height;
  while ((node = node.parent) && (node.height < ++height));
}

export function Node(data) {
  this.data = data;
  this.depth =
  this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};
