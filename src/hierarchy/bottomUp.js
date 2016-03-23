import Node from "../node/index";
import {optional, required, defaultValue, defaultSort} from "./accessors";

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parent;
}

export default function() {
  var id = defaultId,
      parentId = defaultParentId,
      value = defaultValue,
      sort = defaultSort;

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

    root.eachBefore(function(node) {
      if (node.index == null) return node.depth = 0;
      if (!nodes[node.index]) throw new Error("cycle");
      node.depth = node.parent.depth + 1;
      nodes[node.index] = null, --n;
    });

    if (n !== 0) throw new Error("cycle");

    if (value) root.revalue(value);
    if (sort) root.sort(sort);
    return root;
  }

  hierarchy.id = function(x) {
    return arguments.length ? (id = required(x), hierarchy) : id;
  };

  hierarchy.parentId = function(x) {
    return arguments.length ? (parentId = required(x), hierarchy) : parentId;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = optional(x), hierarchy) : value;
  };

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = optional(x), hierarchy) : sort;
  };

  return hierarchy;
}
