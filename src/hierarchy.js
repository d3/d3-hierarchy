import Node from "./node/index";

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function defaultId(d) {
  return d.id;
}

function defaultChildren(d) {
  return d.children;
}

function defaultValue(d) {
  return d.value;
}

function defaultSort(a, b) {
  return b.value - a.value;
}

function detectCycles(n) {
  var visited = new Array(n);
  return function(node) {
    var i = node.index;
    if (visited[i]) throw new Error("cycle");
    node.depth = node.parent ? node.parent.depth + 1 : 0;
    visited[i] = 1;
  };
}

export default function() {
  var strategy = topDown,
      id = defaultId,
      parentId = null,
      children = defaultChildren,
      value = defaultValue,
      sort = defaultSort;

  function hierarchy(data) {
    var root = strategy(data);
    root.evaluate(value);
    if (sort != null) root.sort(sort);
    return root;
  }

  function bottomUp(data) {
    var root = new Node(data),
        i,
        n = data.length,
        d,
        nodeId,
        nodeKey,
        nodeByKey = {},
        nodes = new Array(n),
        node,
        parent;

    for (i = 0; i < n; ++i) {
      nodes[i] = node = new Node(d = data[i]), node.index = i;
      if ((nodeId = id(d, i, data)) != null) {
        nodeKey = keyPrefix + (node.id = nodeId += "");
        if (nodeKey in nodeByKey) throw new Error("duplicate: " + nodeId);
        nodeByKey[nodeKey] = node;
      }
    }

    for (i = 0; i < n; ++i) {
      node = nodes[i], nodeId = parentId(d = data[i], i, data);
      parent = nodeId == null ? root : nodeByKey[keyPrefix + nodeId];
      if (!parent) throw new Error("missing: " + nodeId);
      node.parent = parent;
      if (parent.children) parent.children.push(node);
      else parent.children = [node];
    }

    return root.eachBefore(detectCycles(data.length));
  }

  function topDown(data) {
    var root = new Node(data),
        node = root,
        nodes = [root],
        nodeId,
        child,
        childs,
        i,
        n;

    root.depth = 0;

    while ((node = nodes.pop()) != null) {
      if ((nodeId = id(node.data)) != null) node.id = nodeId + "";
      if ((childs = children(node.data)) && (n = childs.length)) {
        node.children = new Array(n);
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = node.children[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }

    return root;
  }

  hierarchy.id = function(x) {
    return arguments.length ? (id = x, hierarchy) : id;
  };

  hierarchy.parentId = function(x) {
    return arguments.length ? (parentId = x, strategy = bottomUp, children = null, hierarchy) : parentId;
  };

  hierarchy.children = function(x) {
    return arguments.length ? (children = x, strategy = topDown, parentId = null, hierarchy) : children;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = x, hierarchy) : value;
  };

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = x, hierarchy) : sort;
  };

  return hierarchy;
}
