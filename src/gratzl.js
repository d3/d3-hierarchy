function depthSort(a, b) {
  if (a.maxDescendantDepth > b.maxDescendantDepth) {
    return -1;
  } else if (a.maxDescendantDepth < b.maxDescendantDepth) {
    return 1;
  }
  return 0;
}

export default function() {
  var dx = 5,
      dy = 50,
      widths = [];

  function setTreeX(node, val) {
    node.x = val;
    widths[node.depth] = val;
    if (node.children) {
      node.leaves().sort(depthSort).forEach(function(leaf) {
        if (typeof leaf.x === 'undefined') {
          var width = Math.max.apply(null, widths.slice(node.depth, leaf.depth+1));
          setTreeX(leaf, val > width ? val : width + 1)
        }
      })
    }

    if (node.parent && typeof node.parent.x === 'undefined') {
      setTreeX(node.parent, val);
    }
  }

  function tree(root, activeNode) {
     /*
     * set maxDescendantDepth on each node,
     * which is the depth of its deepest child
     *
     * */
    root.leaves().forEach(function(leaf) {
      leaf.ancestors().forEach(function(leafAncestor) {
        if (!leafAncestor.maxDescendantDepth || leaf.depth > leafAncestor.maxDescendantDepth) {
          leafAncestor.maxDescendantDepth = leaf.depth;
        }
      })
    });

    /* rendering should start at the deepest leaf of activeNode. */
    var deepestLeaf = activeNode;
    activeNode.leaves().forEach(function(leaf) {
      if (deepestLeaf.depth < leaf.depth) {
        deepestLeaf = leaf;
      }
    });

    setTreeX(deepestLeaf, 0);

    var maxX = Math.max.apply(null, widths);
    var maxY = Math.max.apply(null, root.leaves().map(function(leaf) { return leaf.depth; }));
    root.each(function(node) {
      sizeNode(node, maxX, maxY)
    });
    return root;
  }

  function sizeNode(node, maxX, maxY) {
    node.x = dx - (dx / maxX) * node.x;
    node.y = (dy / maxY) * node.depth;
  }

  tree.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], tree) : [dx, dy];
  };

  return tree;
}
