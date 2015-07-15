import {default as hierarchy, rebind} from "./hierarchy";
import {defaultSeparation} from "./tree";
import {visitAfter, visitBefore} from "./visit";

function meanX(children) {
  return children.reduce(function(x, c) { return x + c.x; }, 0) / children.length;
}

function maxY(children) {
  return 1 + children.reduce(function(y, c) { return Math.max(y, c.y); }, 0);
}

function leftLeaf(node) {
  var children;
  while ((children = node.children) && children.length) node = children[0];
  return node;
}

function rightLeaf(node) {
  var children, n;
  while ((children = node.children) && (n = children.length)) node = children[n - 1];
  return node;
}

// Implements a hierarchical layout using the cluster (or dendrogram)
// algorithm.
export default function() {
  var layout = hierarchy().sort(null).value(null),
      separation = defaultSeparation,
      size = [1, 1], // width, height
      nodeSize = false;

  function cluster(d, i) {
    var nodes = layout.call(this, d, i),
        root = nodes[0],
        previousNode,
        x = 0;

    // First walk, computing the initial x & y values.
    visitAfter(root, function(node) {
      var children = node.children;
      if (children && children.length) {
        node.x = meanX(children);
        node.y = maxY(children);
      } else {
        node.x = previousNode ? x += separation(node, previousNode) : 0;
        node.y = 0;
        previousNode = node;
      }
    });

    // Compute the left-most, right-most, and depth-most nodes for extents.
    var left = leftLeaf(root),
        right = rightLeaf(root),
        x0 = left.x - separation(left, right) / 2,
        x1 = right.x + separation(right, left) / 2;

    // Second walk, normalizing x & y to the desired size.
    visitAfter(root, nodeSize ? function(node) {
      node.x = (node.x - root.x) * size[0];
      node.y = (root.y - node.y) * size[1];
    } : function(node) {
      node.x = (node.x - x0) / (x1 - x0) * size[0];
      node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
    });

    return nodes;
  }

  cluster.separation = function(x) {
    if (!arguments.length) return separation;
    separation = x;
    return cluster;
  };

  cluster.size = function(x) {
    if (!arguments.length) return nodeSize ? null : size;
    nodeSize = (size = x) == null;
    return cluster;
  };

  cluster.nodeSize = function(x) {
    if (!arguments.length) return nodeSize ? size : null;
    nodeSize = (size = x) != null;
    return cluster;
  };

  return rebind(cluster, layout);
};
