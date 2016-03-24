import enclosingCircle from "./enclosingCircle";
import hierarchyNode from "../node/index";
import hierarchyValue from "../hierarchyValue";
import hierarchySort from "../hierarchySort";
import packCircles from "./circles";
import visitAfter from "../visitAfter";
import visitBefore from "../visitBefore";
import {optional, required, defaultValue, defaultSort} from "../accessors";

export default function() {
  var value = defaultValue,
      sort = defaultSort,
      dx = 1,
      dy = 1,
      padding = 0;

  function pack(data) {
    var root = hierarchyNode(data);
    hierarchyValue(root, value);
    if (sort) hierarchySort(root, sort);
    root.x = dx / 2, root.y = dy / 2;
    visitAfter(root, packChildren);
    if (padding > 0) visitAfter(root, padChildren(padding * root.r / Math.min(dx, dy)));
    visitBefore(root, translateChild(Math.min(dx, dy) / (2 * root.r)));
    return root;
  }

  pack.value = function(x) {
    return arguments.length ? (value = required(x), pack) : value;
  };

  pack.sort = function(x) {
    return arguments.length ? (sort = optional(x), pack) : sort;
  };

  pack.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
  };

  pack.padding = function(x) {
    return arguments.length ? (padding = +x, pack) : padding;
  };

  return pack;
}

function packChildren(node) {
  if (node.children) {
    packCircles(node.children);
    var e = enclosingCircle(node.children);
    node.children.forEach(translateNode(-e.x, -e.y));
    node.r = e.r;
  } else {
    node.r = Math.sqrt(node.value);
  }
}

function padChildren(r) {
  var pad = padNode(r), unpad = padNode(-r);
  return function(node) {
    if (node.children) {
      node.children.forEach(pad);
      packChildren(node);
      node.children.forEach(unpad);
      node.r += r;
    }
  };
}

function padNode(r) {
  return function(node) {
    node.r += r;
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

function translateNode(dx, dy) {
  return function(node) {
    node.x += dx, node.y += dy;
  };
}
