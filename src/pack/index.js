import hierarchy from "../hierarchy";
import rebind from "../rebind";
import enclosingCircle from "./enclosingCircle";
import packCircles from "./circles";

export default function() {
  var layout = hierarchy(),
      dx = 1,
      dy = 1,
      padding = 0;

  function pack(data) {
    var nodes = layout(data);
    position(nodes[0]);
    return nodes;
  }

  function position(root) {
    root.x = dx / 2, root.y = dy / 2;
    root.eachAfter(packChildren);
    if (padding > 0) root.eachAfter(padChildren(padding * root.r / Math.min(dx, dy)));
    root.eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
  }

  rebind(pack, layout);

  pack.revalue = function(nodes) {
    layout.revalue(nodes);
    position(nodes[0]);
    return nodes;
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
