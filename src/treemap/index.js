import hierarchy from "../hierarchy";
import rebind from "../rebind";
import {visitBefore} from "../visit";
import squarify from "./squarify";

export default function() {
  var layout = hierarchy(),
      dx = 1, dy = 1,
      tile = squarify;

  function treemap(d) {
    var nodes = layout(d),
        root = nodes[0];
    root.x0 = root.y0 = 0;
    root.x1 = dx, root.y1 = dy;
    visitBefore(root, function(node) {
      if (node.children) {
        tile(node, node.x0, node.y0, node.x1, node.y1);
      }
    });
    return nodes;
  }

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = x, treemap) : tile;
  };

  return rebind(treemap, layout);
}
