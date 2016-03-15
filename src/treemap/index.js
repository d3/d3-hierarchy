import hierarchy from "../hierarchy";
import rebind from "../rebind";
import {visitBefore} from "../visit";
import squarify from "./squarify";

export default function() {
  var layout = hierarchy(),
      dx = 1,
      dy = 1,
      padSibling = 0,
      padChild = 0,
      tile = squarify,
      round = false;

  function treemap(d) {
    var nodes = layout(d);
    position(nodes[0]);
    return nodes;
  }

  function position(root) {
    root.x0 =
    root.y0 = -padSibling;
    root.x1 = dx + padSibling;
    root.y1 = dy + padSibling;
    visitBefore(root, positionNode);
    if (round) visitBefore(root, treemapRound);
  }

  function positionNode(node) {
    var x0 = node.x0 + padSibling,
        y0 = node.y0 + padSibling,
        x1 = node.x1 - padSibling,
        y1 = node.y1 - padSibling;
    if (x1 < x0) node.x0 = node.x1 = x0 = x1 = (node.x0 + node.x1) / 2;
    else node.x0 = x0, node.x1 = x1;
    if (y1 < y0) node.y0 = node.y1 = x0 = x1 = (node.y0 + node.y1) / 2;
    else node.y0 = y0, node.y1 = y1;
    if (node.children) {
      x0 += padChild - padSibling;
      y0 += padChild - padSibling;
      x1 -= padChild - padSibling;
      y1 -= padChild - padSibling;
      if (x1 < x0) x0 = x1 = (node.x0 + node.x1) / 2;
      if (y1 < y0) y0 = y1 = (node.y0 + node.y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  rebind(treemap, layout);

  treemap.revalue = function(nodes) {
    layout.revalue(nodes);
    position(nodes[0]);
    return nodes;
  };

  treemap.round = function(x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = x, treemap) : tile;
  };

  treemap.paddingChild = function(x) {
    return arguments.length ? (padChild = +x, treemap) : padChild;
  };

  treemap.paddingSibling = function(x) {
    return arguments.length ? (padSibling = x / 2, treemap) : padSibling * 2;
  };

  return treemap;
}

function treemapRound(d) {
  d.x0 = Math.round(d.x0);
  d.y0 = Math.round(d.y0);
  d.x1 = Math.round(d.x1);
  d.y1 = Math.round(d.y1);
}
