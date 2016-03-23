import Node from "../node/index";

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parent;
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
      parentId = defaultParentId;

  function hierarchy(data) {
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

  hierarchy.id = function(x) {
    return arguments.length ? (id = x, hierarchy) : id;
  };

  hierarchy.parentId = function(x) {
    return arguments.length ? (parentId = x, hierarchy) : parentId;
  };

  return hierarchy;
}
