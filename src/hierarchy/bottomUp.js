import Node from "../node/index";
import {required} from "./accessors";

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parent;
}

export default function() {
  var id = defaultId,
      parentId = defaultParentId;

  function hierarchy(data) {
    var root,
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
      if (nodeId == null) {
        if (root) throw new Error("multiple roots");
        root = node;
      } else {
        parent = nodeByKey[keyPrefix + nodeId];
        if (!parent) throw new Error("missing: " + nodeId);
        node.parent = parent;
        if (parent.children) parent.children.push(node);
        else parent.children = [node];
      }
    }

    if (!root) throw new Error("cycle");

    root.eachBefore(function(node) {
      if (!nodes[node.index]) throw new Error("cycle");
      node.depth = node.parent ? node.parent.depth + 1 : 0;
      nodes[node.index] = null, --n;
    });

    if (n !== 0) throw new Error("cycle");

    return root;
  }

  hierarchy.id = function(x) {
    return arguments.length ? (id = required(x), hierarchy) : id;
  };

  hierarchy.parentId = function(x) {
    return arguments.length ? (parentId = required(x), hierarchy) : parentId;
  };

  return hierarchy;
}
