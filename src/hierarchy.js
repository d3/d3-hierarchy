import {map} from "d3-collection";
import {visitAfter, visitBreadth} from "./visit";
import links from "./links";

function defaultId(d, i) {
  return i;
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

function assignDepth(node, depth) {
  node.depth = depth;
}

export function rebind(layout, hierarchy) {

  layout.id = function() {
    var x = hierarchy.id.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.parentId = function() {
    var x = hierarchy.parentId.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.value = function() {
    var x = hierarchy.value.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.sort = function() {
    var x = hierarchy.sort.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  return layout;
};

function Node() {
  this.children = [];
}

export default function() {
  var id = defaultId,
      parentId = defaultParentId,
      value = defaultValue,
      sort = defaultSort;

  function computeNodes(data) {
    var i,
        n = data.length,
        d,
        nodeId,
        nodeById = map(),
        nodes = new Array(n + 1),
        node,
        parent,
        root = nodes[0] = new Node;

    for (i = 0; i < n; ++i) {
      nodeId = id(d = data[i], i, data) + "";
      if (nodeById.has(nodeId)) throw new Error("duplicate: " + nodeId);
      nodeById.set(nodeId, nodes[i + 1] = node = new Node);
      node.id = nodeId;
      node.data = d;
      node.index = i;
    }

    for (i = 0; i < n; ++i) {
      node = nodes[i + 1];
      nodeId = parentId(d = data[i], i, data);
      parent = nodeId == null ? root : nodeById.get(nodeId += "");
      if (!parent) throw new Error("not found: " + nodeId);
      node.parent = parent;
      parent.children.push(node);
    }

    return nodes;
  }

  function computeValue(data) {
    return function(node) {
      var v = node.parent ? +value(node.data, node.index, data) || 0 : 0,
          c = node.children,
          i = c.length;
      while (--i >= 0) v += c[i].value;
      node.value = v;
      c.sort(sort);
    };
  }

  function hierarchy(data) {
    var nodes = computeNodes(data), root = nodes[0], i = -1;
    visitBreadth(root, assignDepth);
    visitAfter(root, computeValue(data));
    visitBreadth(root, function(node) { nodes[++i] = node; });
    return nodes;
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
