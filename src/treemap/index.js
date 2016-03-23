import roundNode from "./round";
import squarify from "./squarify";

export default function() {
  var dx = 1,
      dy = 1,
      paddingInner = 0,
      paddingOuter = 0,
      paddingOffset = 0,
      tile = squarify,
      round = false;

  function treemap(root) {
    root.x0 =
    root.y0 = -paddingInner;
    root.x1 = dx + paddingInner;
    root.y1 = dy + paddingInner;
    root.eachBefore(positionNode);
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(node) {
    var x0 = node.x0 + paddingInner,
        y0 = node.y0 + paddingInner,
        x1 = node.x1 - paddingInner,
        y1 = node.y1 - paddingInner;
    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    if (node.children) {
      x0 += paddingOffset;
      y0 += paddingOffset;
      x1 -= paddingOffset;
      y1 -= paddingOffset;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  treemap.round = function(x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = x, treemap) : tile;
  };

  treemap.padding = function(x) {
    return arguments.length ? (paddingInner = (paddingOuter = +x) / 2, paddingOffset = paddingInner, treemap) : paddingInner * 2;
  };

  treemap.paddingInner = function(x) {
    return arguments.length ? (paddingInner = x / 2, paddingOffset = paddingOuter - paddingInner, treemap) : paddingInner * 2;
  };

  treemap.paddingOuter = function(x) {
    return arguments.length ? (paddingOuter = +x, paddingOffset = paddingOuter - paddingInner, treemap) : paddingOuter;
  };

  return treemap;
}
