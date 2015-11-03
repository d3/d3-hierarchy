import hierarchy, {rebind} from "./hierarchy";

var phi = (1 + Math.sqrt(5)) / 2; // golden ratio

var modes = {
  "slice": 1,
  "dice": 1,
  "slice-dice": 1,
  "squarify": 1
};

function padNone(node) {
  return {x: node.x, y: node.y, dx: node.dx, dy: node.dy};
}

function padStandard(node, padding) {
  var x = node.x + padding[3],
      y = node.y + padding[0],
      dx = node.dx - padding[1] - padding[3],
      dy = node.dy - padding[0] - padding[2];
  if (dx < 0) x += dx / 2, dx = 0;
  if (dy < 0) y += dy / 2, dy = 0;
  return {x: x, y: y, dx: dx, dy: dy};
}

// Places the specified array of *nodes* as a row along the top or left of the
// specified *rect*, whose total area represents the specified *value*. Modifies
// the rect, subtracting the area consumed by the new row.
//
// TODO rounding
// TODO avoid recomputation
function layoutRow(nodes, rect, value) {
  var i = -1,
      n = nodes.length,
      x = rect.x,
      y = rect.y,
      dx = rect.dx,
      dy = rect.dy,
      node,
      sum = 0;

  for (i = 0; i < n; ++i) {
    node = nodes[i];
    sum += node.value;
  }

  if (dx < dy) {
    dy *= sum / value;
    rect.y += dy;
    rect.dy -= dy;

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      node.x = x;
      node.y = y;
      x += node.dx = node.value / sum * dx;
      node.dy = dy;
    }
  } else {
    dx *= sum / value;
    rect.x += dx;
    rect.dx -= dx;

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      node.x = x;
      node.y = y;
      node.dx = dx;
      y += node.dy = node.value / sum * dy;
    }
  }

  return sum;
}

// Squarified Treemaps by Mark Bruls, Kees Huizing, and Jarke J. van Wijk.
// Modified to support a target aspect ratio by Jeff Heer.
export default function() {
  var layout = hierarchy(),
      round = Number,
      size = [1, 1], // width, height
      padding = null,
      pad = padNone,
      sticky = false,
      stickies,
      mode = "squarify",
      ratio = phi;

  function padFunction(node) {
    var p = padding.call(treemap, node, node.depth);
    return p == null
        ? padNone(node)
        : padStandard(node, typeof p === "number" ? [p, p, p, p] : p);
  }

  function padConstant(node) {
    return padStandard(node, padding);
  }

  // Computes the worst aspect ratio for a row of squarified nodes, given the
  // remaining rectangle within which to layout the nodes, and its value.
  // Ρeturns a value greater than or equal to one; a lower value is better.
  function worstRatio(rowNodes, remainingRect, remainingValue) {
    var i = -1,
        n = rowNodes.length,
        r,
        rmax = 0,
        rmin = Infinity,
        s = 0;

    while (++i < n) {
      r = rowNodes[i].value;
      if (!r) continue; // ignore zero-area nodes
      if (r < rmin) rmin = r;
      if (r > rmax) rmax = r;
      s += r;
    }

    // XXX
    var scale = (remainingRect.dx * remainingRect.dy) / remainingValue,
        w = Math.min(remainingRect.dx, remainingRect.dy);
    s *= scale;
    rmax *= scale;
    rmin *= scale;

    return Math.max(
      (w * w * rmax * ratio) / (s * s),
      (s * s) / (w * w * rmin * ratio)
    );
  }

  // mode === "slice" ? rowVertical
  // : mode === "dice" ? rowVertical
  // : mode === "slice-dice" ? node.depth & 1 ? placeVertical : placeVertical

  // Recursively arranges the specified node’s children into squarified rows.
  // TODO implement other modes using another method, not squarify
  function squarify(parent) {
    var children = parent.children;
    if (children && (n = children.length)) {
      var i = -1,
          n,
          child,
          remainingRect = pad(parent),
          remainingValue = parent.value,
          rowNodes = [],
          rowRatio,
          minRatio = Infinity;

      while (++i < n) {
        child = children[i];
        rowNodes.push(child);
        rowRatio = worstRatio(rowNodes, remainingRect, remainingValue);
        if (rowRatio <= minRatio) { // continue with this orientation
          minRatio = rowRatio;
        } else { // abort and try a different orientation
          --i;
          rowNodes.pop();
          remainingValue -= layoutRow(rowNodes, remainingRect, remainingValue);
          minRatio = Infinity;
          rowNodes = [];
        }
      }

      if (rowNodes.length) {
        layoutRow(rowNodes, remainingRect, remainingValue);
      }

      children.forEach(squarify);
    }
  }

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
    var nodes = stickies || layout(d),
        root = nodes[0];
    root.x = 0;
    root.y = 0;
    root.dx = size[0];
    root.dy = size[1];
    if (stickies) layout.revalue(root);
    // scale([root], root.dx * root.dy / root.value);
    (stickies ? stickify : squarify)(root);
    if (sticky) stickies = nodes;
    return nodes;
  }

  treemap.size = function(x) {
    if (!arguments.length) return size.slice();
    size = [+x[0], +x[1]];
    return treemap;
  };

  treemap.padding = function(x) {
    if (!arguments.length) return Array.isArray(padding) ? padding.slice() : padding;
    var t;
    pad = x == null ? (padding = null, padNone)
        : (t = typeof x) === "function" ? (padding = x, padFunction)
        : t === "number" ? (padding = [x, x, x, x], padConstant)
        : (padding = [+x[0], +x[1], +x[2], +x[3]], padConstant);
    return treemap;
  };

  treemap.round = function(x) {
    if (!arguments.length) return round !== Number;
    round = x ? Math.round : Number;
    return treemap;
  };

  treemap.sticky = function(x) {
    if (!arguments.length) return sticky;
    sticky = !!x, stickies = null;
    return treemap;
  };

  treemap.ratio = function(x) {
    if (!arguments.length) return ratio;
    ratio = +x;
    return treemap;
  };

  treemap.mode = function(x) {
    if (!arguments.length) return mode;
    mode = modes.hasOwnProperty(x) ? x + "" : "squarify";
    return treemap;
  };

  return rebind(treemap, layout);
};
