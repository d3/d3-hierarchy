import hierarchy, {rebind} from "./hierarchy";

var phi = (1 + Math.sqrt(5)) / 2;

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

function nodeSlice(nodes, rect, value) {
  var i0 = -1,
      n = nodes.length,
      node,
      x = rect.x, y = rect.y,
      dx = rect.dx, dy = rect.dy,
      ky = dy / value;

  while (++i0 < n) {
    node = nodes[i0], node.x = x, node.y = y, node.dx = dx;
    y += node.dy = node.value * ky;
  }
}

function nodeDice(nodes, rect, value) {
  var i0 = -1,
      n = nodes.length,
      node,
      x = rect.x, y = rect.y,
      dx = rect.dx, dy = rect.dy,
      kx = dx / value;

  while (++i0 < n) {
    node = nodes[i0], node.x = x, node.y = y, node.dy = dy;
    x += node.dx = node.value * kx;
  }
}

function nodeRound(node) {
  node.dx = Math.round(node.x + node.dx) - (node.x = Math.round(node.x));
  node.dy = Math.round(node.y + node.dy) - (node.y = Math.round(node.y));
}

export default function() {
  var layout = hierarchy(),
      round = false,
      size = [1, 1],
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

  function nodeSquarify(nodes, rect, value) {
    var i0 = 0,
        i1,
        n = nodes.length,
        node,
        nodeValue,
        x = rect.x, y = rect.y,
        dx = rect.dx, dy = rect.dy,
        cx, cy,
        kx, ky,
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
  }

  function recurse(parent) {
    var children = parent.children;
    if (children) {
      (mode === "slice" ? nodeSlice
          : mode === "dice" ? nodeDice
          : mode === "slice-dice" ? parent.depth & 1 ? nodeSlice : nodeDice
          : nodeSquarify)(children, pad(parent), parent.value);
      if (round) children.forEach(nodeRound);
      children.forEach(recurse);
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
    (stickies ? stickify : recurse)(root);
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
    if (!arguments.length) return round;
    round = !!x;
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
