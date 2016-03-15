import {map} from "d3-collection";
import {visitAfter, visitBreadth} from "./visit";

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

function assignDepth(node, depth) {
  node.depth = depth;
}

function detectCycles(n) {
  var visited = new Array(n);
  return function(node) {
    var i = node.index;
    if (visited[i]) throw new Error("cycle");
    visited[i] = 1;
  };
}

function Node() {}

export default function() {
  var id = defaultId,
      parentId = defaultParentId,
      value = defaultValue,
      sort = defaultSort;

  function hierarchy(data) {
    var nodes = computeNodes(data), root = nodes[0], i = -1;
    visitAfter(root, detectCycles(data.length));
    visitBreadth(root, assignDepth);
    visitAfter(root, computeValue(data));
    visitBreadth(root, function(node) {
      if (node.children) node.children.sort(sort);
      nodes[++i] = node;
    });
    nodes.data = data;
    return nodes;
  }

  function computeNodes(data) {
    var i,
        n = data.length,
        d,
        nodeId,
        nodeById = map(),
        nodes = new Array(n),
        node,
        parent,
        root;

    for (i = 0; i < n; ++i) {
      nodeId = id(d = data[i], i, data) + "";
      if (nodeById.has(nodeId)) throw new Error("duplicate: " + nodeId);
      nodeById.set(nodeId, nodes[i] = node = new Node);
      node.id = nodeId;
      node.data = d;
      node.index = i;
    }

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      nodeId = parentId(d = data[i], i, data);
      if (nodeId == null) {
        if (root) throw new Error("multiple roots");
        root = nodes[0], nodes[0] = node, nodes[i] = root;
      } else {
        parent = nodeById.get(nodeId += "");
        if (!parent) throw new Error("missing: " + nodeId);
        node.parent = parent;
        if (parent.children) parent.children.push(node);
        else parent.children = [node];
      }
    }

    if (!root) throw new Error("cycle");
    return nodes;
  }

  function computeValue(data) {
    return function(node) {
      var sum = +value(node.data, node.index, data) || 0,
          children = node.children,
          i = children && children.length;
      while (--i >= 0) sum += children[i].value;
      node.value = sum;
    };
  }

  hierarchy.revalue = function(nodes) {
    visitAfter(nodes[0], computeValue(nodes.data));
    return nodes;
  };

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
