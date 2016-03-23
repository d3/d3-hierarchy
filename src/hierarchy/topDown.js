import newNode from "../node/index";
import {required} from "./accessors";

function defaultChildren(d) {
  return d.children;
}

export default function() {
  var children = defaultChildren;

  function hierarchy(data) {
    var root = newNode(data),
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
          nodes.push(child = node.children[i] = newNode(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }

    return root;
  }

  hierarchy.children = function(x) {
    return arguments.length ? (children = required(x), hierarchy) : children;
  };

  return hierarchy;
}
