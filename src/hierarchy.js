import Node from "./node/index";

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parent;
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
  var id = defaultId,
      parentId = defaultParentId,
      value = defaultValue,
      sort = defaultSort;

  function hierarchy(data) {
    var i,
        n = data.length,
        d,
        nodeId,
        nodeKey,
        nodeByKey = {},
        nodes = new Array(n),
        node,
        parent,
        root = new Node(data);

    for (i = 0; i < n; ++i) {
      nodes[node.index = i] = node = new Node(d = data[i]);
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

    root.eachBefore(detectCycles(data.length));
    root.evaluate(value);
    if (sort != null) root.sort(sort);
    return root;
  }

  hierarchy.id = function(x) {
    return arguments.length ? (id = x, hierarchy) : id;
  };

  hierarchy.parentId = function(x) {
    return arguments.length ? (parentId = x, hierarchy) : parentId;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = x, hierarchy) : value;
  };

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = x, hierarchy) : sort;
  };

  return hierarchy;
}
