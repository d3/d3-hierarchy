import hierarchy, {rebind} from "../hierarchy";
import {visitBefore} from "../visit";

function pad(node, top, right, bottom, left) {
  var x = node.x + left,
      y = node.y + top,
      dx = node.dx - right - left,
      dy = node.dy - top - bottom;
  if (dx < 0) x += dx / 2, dx = 0;
  if (dy < 0) y += dy / 2, dy = 0;
  return {x: x, y: y, dx: dx, dy: dy};
}

// function padConstant(padding) {
//   return function(node) {
//     pad(node, padding[0], padding[1], padding[2], padding[3]);
//   };
// }

// function padFunction(padding) {
//   return function(node) {
//     var p = padding.call(treemap, node, node.depth);
//     if (p == null) return;
//     if (Array.isArray(p)) pad(node, +p[0], +p[1], +p[2], +p[3]);
//     else p = +p, pad(node, p, p, p, p);
//   };
// }

function applyRound(node) {
  node.dx = Math.round(node.x + node.dx) - (node.x = Math.round(node.x));
  node.dy = Math.round(node.y + node.dy) - (node.y = Math.round(node.y));
}

export default function() {
  var layout = hierarchy(),
      size = [1, 1],
      childPadding = 0,
      siblingPadding = 0,
      // applyPadding,
      tile = squarify,
      round = false;
      // sticky = false,
      // stickies;

  // // Recursively resizes the specified node's children into existing rows.
  // // Preserves the existing layout!
  // function stickify(node) {
  //   var children = node.children;
  //   if (children && children.length) {
  //     var rect = pad(node),
  //         remaining = children.slice(), // copy-on-write
  //         child,
  //         row = [];
  //     scale(remaining, rect.dx * rect.dy / node.value);
  //     row.area = 0;
  //     while (child = remaining.pop()) {
  //       row.push(child);
  //       row.area += child.area;
  //       if (child.z != null) {
  //         position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
  //         row.length = row.area = 0;
  //       }
  //     }
  //     children.forEach(stickify);
  //   }
  // }

  function treemap(d) {
    var nodes = /* stickies ||*/ layout(d),
        root = nodes[0];
    root.x = 0;
    root.y = 0;
    root.dx = size[0] + siblingPadding;
    root.dy = size[1] + siblingPadding;
    visitBefore(root, function(node) {
      if (round) applyRound(node);
      if (node.children) mode(node, pad(node, childPadding, childPadding, childPadding, childPadding));
      node.dx = Math.max(0, node.dx - siblingPadding);
      node.dy = Math.max(0, node.dy - siblingPadding);
    });
    // if (stickies) layout.revalue(root);
    // scale([root], root.dx * root.dy / root.value);
    // (stickies ? stickify : recurse)(root);
    // if (sticky) stickies = nodes;
    return nodes;
  }

  treemap.size = function(x) {
    if (!arguments.length) return size.slice();
    size = [+x[0], +x[1]];
    return treemap;
  };

  // TODO asymmetric padding
  treemap.childPadding = function(x) {
    if (!arguments.length) return childPadding;
    childPadding = +x;
    return treemap;
  };

  // TODO asymmetric padding
  treemap.siblingPadding = function(x) {
    if (!arguments.length) return siblingPadding;
    siblingPadding = +x;
    return treemap;
  };

  // treemap.padding = function(x) {
  //   if (!arguments.length) return Array.isArray(padding) ? padding.slice() : padding;
  //   var t;
  //   applyPadding = x == null ? padding = null
  //       : (t = typeof x) === "function" ? padFunction(padding = x)
  //       : (Array.isArray(x)
  //           ? (padding = [+x[0], +x[1], +x[2], +x[3]])
  //           : (x = +x, padding = [x, x, x, x])
  //           , padConstant(padding));
  //   return treemap;
  // };

  treemap.round = function(x) {
    if (!arguments.length) return round;
    round = !!x;
    return treemap;
  };

  // TODO
  // treemap.sticky = function(x) {
  //   if (!arguments.length) return sticky;
  //   sticky = !!x, stickies = null;
  //   return treemap;
  // };

  // treemap.ratio = function(x) {
  //   if (!arguments.length) return ratio;
  //   ratio = +x;
  //   if (modeName === "squarify") applyMode = squarify(ratio);
  //   return treemap;
  // };

  treemap.tile = function(x) {
    if (!arguments.length) return modeName;
    modeName = modeByName.hasOwnProperty(x += "") ? x : "squarify";
    applyMode = modeName === "squarify" ? squarify(ratio) : modeByName[modeName];
    return treemap;
  };

  return rebind(treemap, layout);
}
