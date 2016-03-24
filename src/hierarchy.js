import {required} from "./accessors";
import visitBefore from "./visitBefore";

var keyPrefix = "$", // Protect against keys like “__proto__”.
    reserved = {id: 1, children: 1};

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parentId;
}

export default function() {
  var id = defaultId,
      parentId = defaultParentId;

  function hierarchy(data) {
    var d,
        k,
        i,
        n = data.length,
        root,
        parent,
        node,
        nodes = new Array(n),
        nodeId,
        nodeKey,
        nodeByKey = {};

    for (i = 0; i < n; ++i) {
      d = data[i], node = nodes[i] = {};
      for (k in d) if (!(k in reserved)) node[k] = d[k];
      if ((nodeId = id(d, i, data)) != null && (nodeId += "")) {
        nodeKey = keyPrefix + (node.id = nodeId);
        if (nodeKey in nodeByKey) throw new Error("duplicate: " + nodeId);
        nodeByKey[nodeKey] = node;
      }
    }

    for (i = 0; i < n; ++i) {
      node = nodes[i], nodeId = parentId(data[i], i, data);
      if (nodeId == null || !(nodeId += "")) {
        if (root) throw new Error("multiple roots");
        root = node;
      } else {
        parent = nodeByKey[keyPrefix + nodeId];
        if (!parent) throw new Error("missing: " + nodeId);
        if (parent.children) parent.children.push(node);
        else parent.children = [node];
      }
    }

    if (!root) throw new Error("no root");
    visitBefore(root, function() { --n; });
    if (n > 0) throw new Error("cycle");

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
