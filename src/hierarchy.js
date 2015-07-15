import {visitAfter, visitBefore} from "./visit";
import links from "./links";

function defaultChildren(d) {
  return d.children;
}

function defaultValue(d) {
  return d.value;
}

function defaultSort(a, b) {
  return b.value - a.value;
}

export function rebind(layout, hierarchy) {

  layout.sort = function() {
    var x = hierarchy.sort.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.children = function() {
    var x = hierarchy.children.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.value = function() {
    var x = hierarchy.value.apply(hierarchy, arguments);
    return x === hierarchy ? layout : x;
  };

  layout.nodes = layout;
  layout.links = links;

  return layout;
};

export default function() {
  var sort = defaultSort,
      children = defaultChildren,
      value = defaultValue;

  function hierarchy(root) {
    var stack = [root],
        nodes = [],
        node;

    root.parent = null;
    root.depth = 0;

    while ((node = stack.pop()) != null) {
      nodes.push(node);
      if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
        var n, childs, child;
        while (--n >= 0) {
          stack.push(child = childs[n]);
          child.parent = node;
          child.depth = node.depth + 1;
        }
        if (value) node.value = 0;
        node.children = childs;
      } else {
        if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
        delete node.children;
      }
    }

    visitAfter(root, function(node) {
      var childs, parent;
      if (sort && (childs = node.children)) childs.sort(sort);
      if (value && (parent = node.parent)) parent.value += node.value;
    });

    return nodes;
  }

  hierarchy.nodes = hierarchy;

  hierarchy.links = links;

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = x, hierarchy) : sort;
  };

  hierarchy.children = function(x) {
    return arguments.length ? (children = x, hierarchy) : children;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = x, hierarchy) : value;
  };

  hierarchy.revalue = function(root) {
    if (value) {
      visitBefore(root, function(node) {
        if (node.children) node.value = 0;
      });
      visitAfter(root, function(node) {
        var parent;
        if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
        if (parent = node.parent) parent.value += node.value;
      });
    }
    return root;
  };

  return hierarchy;
};
