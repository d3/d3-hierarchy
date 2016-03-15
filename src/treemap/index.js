import hierarchy from "../hierarchy";
import rebind from "../rebind";
import {visitBefore} from "../visit";
import squarify from "./squarify";

export default function() {
  var layout = hierarchy(),
      dx = 1, dy = 1,
      tile = squarify,
      round = false;

  function treemap(d) {
    var nodes = layout(d);
    position(nodes[0]);
    return nodes;
  }

  function position(root) {
    root.x0 = root.y0 = 0, root.x1 = dx, root.y1 = dy;
    visitBefore(root, function(node) {
      if (node.children) {
        tile(node, node.x0, node.y0, node.x1, node.y1);
      }
    });
    if (round) visitBefore(root, treemapRound);
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

  return treemap;
}

function treemapRound(d) {
  d.x0 = Math.round(d.x0);
  d.y0 = Math.round(d.y0);
  d.x1 = Math.round(d.x1);
  d.y1 = Math.round(d.y1);
}
