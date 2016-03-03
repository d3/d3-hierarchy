import hierarchy, {rebind} from "./hierarchy";
import {visitBefore} from "./visit";

var phi = (1 + Math.sqrt(5)) / 2;

var modeByName = {
  "slice": slice,
  "dice": dice,
  "slice-dice": sliceDice,
  "squarify": squarify
};

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

function sliceDice(parent, rect) {
  (parent.depth & 1 ? slice : dice)(parent, rect);
}

function slice(parent, rect) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      x = rect.x,
      y = rect.y,
      dx = rect.dx,
      ky = rect.dy / parent.value;

  while (++i < n) {
    node = nodes[i], node.x = x, node.y = y, node.dx = dx;
    y += node.dy = node.value * ky;
  }
}

function dice(parent, rect) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      x = rect.x,
      y = rect.y,
      dy = rect.dy,
      kx = rect.dx / parent.value;

  while (++i < n) {
    node = nodes[i], node.x = x, node.y = y, node.dy = dy;
    x += node.dx = node.value * kx;
  }
}

function squarify(ratio) {
  return function(parent, rect) {
    var nodes = parent.children,
        node,
        nodeValue,
        i0 = 0,
        i1,
        n = nodes.length,
        x = rect.x,
        y = rect.y,
        dx = rect.dx,
        dy = rect.dy,
        cx, cy,
        kx, ky,
        value = parent.value,
        sumValue,
        minValue,
        maxValue,
        alpha,
        beta,
        newRatio,
        minRatio;

    while (i0 < n) {
      cx = x, cy = y;
      sumValue = minValue = maxValue = nodes[i0].value;
      alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
      beta = sumValue * sumValue * alpha;
      minRatio = Math.max(maxValue / beta, beta / minValue);

      // Keep adding nodes while the aspect ratio maintains or improves.
      for (i1 = i0 + 1; i1 < n; ++i1) {
        sumValue += nodeValue = nodes[i1].value;
        if (nodeValue < minValue) minValue = nodeValue;
        if (nodeValue > maxValue) maxValue = nodeValue;
        beta = sumValue * sumValue * alpha;
        newRatio = Math.max(maxValue / beta, beta / minValue);
        if (newRatio > minRatio) { sumValue -= nodeValue; break; }
        minRatio = newRatio;
      }

      // Position the row horizontally along the top of the rect.
      if (dx < dy) for (kx = dx / sumValue, ky = dy * sumValue / value, y += ky, dy -= ky; i0 < i1; ++i0) {
        node = nodes[i0], node.x = cx, node.y = cy, node.dy = ky;
        cx += node.dx = node.value * kx;
      }

      // Position the row vertically along the left of the rect.
      else for (ky = dy / sumValue, kx = dx * sumValue / value, x += kx, dx -= kx; i0 < i1; ++i0) {
        node = nodes[i0], node.x = cx, node.y = cy, node.dx = kx;
        cy += node.dy = node.value * ky;
      }

      value -= sumValue;
    }
  };
}

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
      ratio = phi,
      round = false,
      // sticky = false,
      // stickies,
      modeName = "squarify",
      applyMode = squarify(ratio);

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
      if (node.children) applyMode(node, pad(node, childPadding, childPadding, childPadding, childPadding));
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

  treemap.ratio = function(x) {
    if (!arguments.length) return ratio;
    ratio = +x;
    if (modeName === "squarify") applyMode = squarify(ratio);
    return treemap;
  };

  treemap.mode = function(x) {
    if (!arguments.length) return modeName;
    modeName = modeByName.hasOwnProperty(x += "") ? x : "squarify";
    applyMode = modeName === "squarify" ? squarify(ratio) : modeByName[modeName];
    return treemap;
  };

  return rebind(treemap, layout);
}
