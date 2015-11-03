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

// Positions a slice [i0:i1] of *nodes*, whose total value is *nodesValue*, as a
// new horizontal row along the top of the specified *rect*, whose total area
// represents the specified *rectValue*. Modifies the rect, subtracting the area
// consumed by the new row.
function rowHorizontal(nodes, i0, i1, nodesValue, rect, rectValue) {
  var i,
      x = rect.x,
      y = rect.y,
      kx = rect.dx / nodesValue,
      dy = rect.dy,
      node;
  dy *= nodesValue / rectValue, rect.y += dy, rect.dy -= dy;
  for (i = i0; i < i1; ++i) {
    node = nodes[i], node.x = x, node.y = y, node.dy = dy;
    x += node.dx = node.value * kx;
  }
}

// Positions a slice [i0:i1] of *nodes*, whose total value is *nodesValue*, as a
// new vertical row along the left of the specified *rect*, whose total area
// represents the specified *rectValue*. Modifies the rect, subtracting the area
// consumed by the new row.
function rowVertical(nodes, i0, i1, nodesValue, rect, rectValue) {
  var i,
      x = rect.x,
      y = rect.y,
      dx = rect.dx,
      ky = rect.dy / nodesValue,
      node;
  dx *= nodesValue / rectValue, rect.x += dx, rect.dx -= dx;
  for (i = i0; i < i1; ++i) {
    node = nodes[i], node.x = x, node.y = y, node.dx = dx;
    y += node.dy = node.value * ky;
  }
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
      var i0 = 0,
          i1 = -1,
          n,
          child,
          childValue,
          rect = pad(parent),
          value = parent.value,
          row,
          rowScale,
          rowValue = 0,
          rowArea2,
          rowMinValue = Infinity,
          rowMaxValue = 0,
          rowRatio,
          minRatio = Infinity;

      if (rect.dx < rect.dy) row = rowHorizontal, rowScale = rect.dy / (rect.dx * value * ratio);
      else row = rowVertical, rowScale = rect.dx / (rect.dy * value * ratio);

      while (++i1 < n) {
        child = children[i1];
        rowValue += childValue = child.value;
        if (childValue < rowMinValue) rowMinValue = childValue;
        if (childValue > rowMaxValue) rowMaxValue = childValue;
        rowArea2 = rowValue * rowValue * rowScale;
        rowRatio = Math.max(rowMaxValue / rowArea2, rowArea2 / rowMinValue);

        // If this node doesn’t worsen the current row’s aspect ratio, add it.
        if (rowRatio <= minRatio) minRatio = rowRatio;

        // Otherwise, finish the current row and add this node to a new row.
        else {
          row(children, i0, i1, rowValue -= childValue, rect, value);
          value -= rowValue;
          i0 = i1--;

          // TODO better reset
          if (rect.dx < rect.dy) row = rowHorizontal, rowScale = rect.dy / (rect.dx * value * ratio);
          else row = rowVertical, rowScale = rect.dx / (rect.dy * value * ratio);

          rowValue = 0;
          rowMinValue = Infinity;
          rowMaxValue = 0;
          minRatio = Infinity;
        }
      }

      if (i0 < n) row(children, i0, n, rowValue, rect, value);

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
