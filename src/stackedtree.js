function defaultSeparation(a, b) {
  return a.parent === b.parent ? 0 : 1;
}

function defaultStacking(a, b, n) {
    return a.parent === b.parent ? 1 / n : 0;
}

function meanX(children) {
  return children.reduce(meanXReduce, 0) / children.length;
}

function meanXReduce(x, c) {
  return x + c.x;
}

function maxY(children) {
  return children.reduce(maxYReduce, 1);
}

function maxYReduce(y, c) {
  return Math.max(y, c.y);
}

function leafLeft(node) {
  var children;
  while (children = node.children) node = children[0];
  return node;
}

function leafRight(node) {
  var children;
  while (children = node.children) node = children[children.length - 1];
  return node;
}

export default function() {
  var separation = defaultSeparation,
      stacking = defaultStacking,
      ratio = 1,
      dx = 1,
      dy = 1,
      nodeSize = false;

  function stackedtree(root) {
    var previousNode,
        stackHeight = 1,
        y = 0,
        x = 0;

    // Find longest children array to calculate stacking distance
    root.each(function(node){
      var leaves = node.children;
      stackHeight = leaves ? Math.max(node.children.length, stackHeight) : stackHeight;
    })

    // First walk, computing the initial x & y values.
    root.eachAfter(function(node) {

      // TODO: Is this flexible enough?
      // Resetting y for new stack
      y = previousNode && previousNode.parent !== node.parent ? 0 : y;

      var children = node.children;
      if (children) {
        node.x = meanX(children);
        node.y = ratio + maxY(children);
      } else {
        node.x = previousNode ? x += separation(node, previousNode) : 0;
        node.y = previousNode ? y += stacking(node, previousNode, stackHeight) : 0;
        previousNode = node;
      }
    });

    var left = leafLeft(root),
        right = leafRight(root),
        x0 = left.x - separation(left, right) / 2,
        x1 = right.x + separation(right, left) / 2;

    // Second walk, normalizing x & y to the desired size.
    return root.eachAfter(nodeSize ? function(node) {
      node.x = (node.x - root.x) * dx;
      node.y = (root.y - node.y) * dy;
    } : function(node) {
      node.x = (node.x - x0) / (x1 - x0) * dx;
      node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
    });
  }

  stackedtree.separation = function(x) {
    return arguments.length ? (separation = x, stackedtree) : separation;
  };

  stackedtree.stacking = function(y) {
    return arguments.length ? (stacking = y, stackedtree) : stacking;
  };

  stackedtree.ratio = function(x) {
    // TODO: This a good solution?
    // Tree-to-Stack Ratio from 0 to 1 (default: 1)
    // Lower value means less emphasis on the tree, more on the stacks.
    return arguments.length ? (ratio = x, stackedtree) : ratio;
  };

  stackedtree.size = function(x) {
    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], stackedtree) : (nodeSize ? null : [dx, dy]);
  };

  stackedtree.nodeSize = function(x) {
    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], stackedtree) : (nodeSize ? [dx, dy] : null);
  };

  return stackedtree;
}
