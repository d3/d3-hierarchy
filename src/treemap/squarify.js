import treemapDice from "./dice";
import treemapSlice from "./slice";

export default (function custom(ratio) {

  function squarify(parent, x0, y0, x1, y1) {
    if (parent._squarify) return resquarify(parent, x0, y0, x1, y1);

    var squarified = parent._squarify = [],
        nodes = parent.children,
        row,
        nodeValue,
        i0 = 0,
        i1,
        n = nodes.length,
        dx, dy,
        value = parent.value,
        sumValue,
        minValue,
        maxValue,
        newRatio,
        minRatio,
        alpha,
        beta;

    while (i0 < n) {
      dx = x1 - x0, dy = y1 - y0;
      minValue = maxValue = sumValue = nodes[i0].value;
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

      // Position and record the row orientation.
      squarified.push(row = {value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)});
      if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
      else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
      value -= sumValue, i0 = i1;
    }
  }

  squarify.ratio = function(x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return squarify;
})((1 + Math.sqrt(5)) / 2, false);

function resquarify(parent, x0, y0, x1, y1) {
  var squarified = parent._squarify,
      row,
      nodes,
      i,
      j = -1,
      n,
      m = squarified.length,
      value = parent.value;

  while (++j < m) {
    row = squarified[j], nodes = row.children;
    for (i = row.value = 0, n = nodes.length; i < n; ++i) row.value += nodes[i].value;
    if (row.dice) treemapDice(row, x0, y0, x1, y0 += (y1 - y0) * row.value / value);
    else treemapSlice(row, x0, y0, x0 += (x1 - x0) * row.value / value, y1);
    value -= row.value;
  }
}
