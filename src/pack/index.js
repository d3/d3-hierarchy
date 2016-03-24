import enclosingCircle from "./enclosingCircle";
import hierarchyNode from "../node/index";
import hierarchyValue from "../hierarchyValue";
import hierarchySort from "../hierarchySort";
import packCircles from "./circles";
import visitAfter from "../visitAfter";
import visitBefore from "../visitBefore";
import {optional, required, defaultValue, defaultSort} from "../accessors";

function defaultRadius(d) {
  return Math.sqrt(d.value);
}

export default function() {
  var radius = null,
      value = defaultValue,
      sort = defaultSort,
      dx = 1,
      dy = 1,
      padding = 0;

  function pack(data) {
    var root = hierarchyNode(data);
    if (value) hierarchyValue(root, value);
    if (sort) hierarchySort(root, sort);
    root.x = dx / 2, root.y = dy / 2;
    if (radius) {
      visitAfter(root, radiusLeaf(radius));
      visitAfter(root, padChildren(padding / 2));
      visitBefore(root, translateChild(1));
    } else {
      visitAfter(root, radiusLeaf(defaultRadius));
      visitAfter(root, packChildren);
      if (padding) visitAfter(root, padChildren(padding * root.r / Math.min(dx, dy)));
      visitBefore(root, translateChild(Math.min(dx, dy) / (2 * root.r)));
    }
    return root;
  }

  pack.radius = function(x) {
    return arguments.length ? (radius = optional(x), pack) : radius;
  };

  pack.value = function(x) {
    return arguments.length ? (value = optional(x), pack) : value;
  };

  pack.sort = function(x) {
    return arguments.length ? (sort = optional(x), pack) : sort;
  };

  pack.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
  };

  pack.padding = function(x) {
    return arguments.length ? (padding = Math.max(0, +x || 0), pack) : padding;
  };

  return pack;
}

function radiusLeaf(radius) {
  return function(node) {
    if (!node.children) {
      node.r = Math.max(0, +radius(node) || 0);
    }
  };
}

function packChildren(node) {
  if (children = node.children) {
    packCircles(children);

    var circle = enclosingCircle(children),
        children,
        child,
        i,
        n = children.length;

    for (i = 0; i < n; ++i) {
      child = children[i];
      child.x -= circle.x;
      child.y -= circle.y;
    }

    node.r = circle.r;
  }
}

function padChildren(padRadius) {
  return function(node) {
    if (children = node.children) {
      var children, i, n = children.length;
      for (i = 0; i < n; ++i) children[i].r += padRadius;
      packChildren(node);
      for (i = 0; i < n; ++i) children[i].r -= padRadius;
      node.r += padRadius;
    }
  };
}

function translateChild(k) {
  return function(node) {
    var parent = node.parent;
    node.r *= k;
    if (parent) {
      node.x = parent.x + k * node.x;
      node.y = parent.y + k * node.y;
    }
  };
}
