import Node from "../node/index";
import {optional, required, defaultValue, defaultSort} from "./accessors";

function defaultChildren(d) {
  return d.children;
}

export default function() {
  var children = defaultChildren,
      value = defaultValue,
      sort = defaultSort;

  function hierarchy(data) {
    var root = new Node(data),
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

    if (value) root.revalue(value);
    if (sort && (value || sort !== defaultSort)) root.sort(sort);
    return root;
  }

  hierarchy.children = function(x) {
    return arguments.length ? (children = required(x), hierarchy) : children;
  };

  hierarchy.value = function(x) {
    return arguments.length ? (value = optional(x), hierarchy) : value;
  };

  hierarchy.sort = function(x) {
    return arguments.length ? (sort = optional(x), hierarchy) : sort;
  };

  return hierarchy;
}
