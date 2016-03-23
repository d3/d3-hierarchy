import Node from "./node/index";

function defaultChildren(d) {
  return d.children;
}

function defaultValue(d) {
  return d.value;
}

function defaultSort(a, b) {
  return b.value - a.value;
}

export default function() {
  var children = defaultChildren,
      value = defaultValue,
      sort = defaultSort;

  function hierarchy(datum) {
    var root = new Node(datum),
        node = root,
        nodes = [root],
        child,
        childs,
        i,
        n;

    root.depth = 0;

    while ((node = nodes.pop()) != null) {
      if ((childs = children(node.data)) && (n = childs.length)) {
        node.children = new Array(n);
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = node.children[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }

    root.evaluate(value);
    if (sort != null) root.sort(sort);
    return root;
  }

  hierarchy.children = function(x) {
    return arguments.length ? (children = x, hierarchy) : children;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = x, hierarchy) : value;
  };

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = x, hierarchy) : sort;
  };

  return hierarchy;
}
