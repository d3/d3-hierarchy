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

  // mode === "slice" ? rowVertical
  // : mode === "dice" ? rowVertical
  // : mode === "slice-dice" ? node.depth & 1 ? rowVertical : rowVertical

  // Recursively arranges the specified node’s children into squarified rows.
  // TODO implement other modes using another method, not squarify
  function squarify(parent) {
    var children = parent.children;
    if (children && (n = children.length)) {
      var i0,
          i1,
          n,
          child,
          childValue,
          rect = pad(parent),
          x = rect.x, y = rect.y,
          dx = rect.dx, dy = rect.dy,
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

      for (i0 = 0; i0 < n; i0 = i1) {
        cx = x, cy = y;
        sumValue = minValue = maxValue = children[i0].value;
        alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);

        // Keep adding nodes while the aspect ratio maintains or improves.
        for (i1 = i0 + 1; i1 < n; ++i1) {
          sumValue += childValue = children[i1].value;
          if (childValue < minValue) minValue = childValue;
          if (childValue > maxValue) maxValue = childValue;
          beta = sumValue * sumValue * alpha;
          newRatio = Math.max(maxValue / beta, beta / minValue);
          if (newRatio > minRatio) { sumValue -= childValue; break; }
          minRatio = newRatio;
        }

        // Position the row horizontally along the top of the rect.
        if (dx < dy) for (kx = dx / sumValue, ky = dy * sumValue / value, y += ky, dy -= ky; i0 < i1; ++i0) {
          child = children[i0], child.x = cx, child.y = cy, child.dy = ky;
          cx += child.dx = child.value * kx;
        }

        // Position the row vertically along the left of the rect.
        else for (ky = dy / sumValue, kx = dx * sumValue / value, x += kx, dx -= kx; i0 < i1; ++i0) {
          child = children[i0], child.x = cx, child.y = cy, child.dx = kx;
          cy += child.dy = child.value * ky;
        }

        value -= sumValue;
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
