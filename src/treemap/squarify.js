export default (function custom(ratio) {

  function squarify(parent, x0, y0, x1, y1) {
    var nodes = parent.children,
        node,
        nodeValue,
        i0 = 0,
        i1,
        n = nodes.length,
        x2, y2,
        dx, dy,
        value = parent.value,
        sumValue,
        minValue,
        maxValue,
        alpha,
        beta,
        newRatio,
        minRatio;

    while (i0 < n) {
      dx = x1 - x0, dy = y1 - y0;
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
      if (dx < dy) {
        for (x2 = x0, y2 = y0 + dy * sumValue / value, dx /= sumValue; i0 < i1; ++i0) {
          node = nodes[i0], node.x0 = x2, node.y0 = y0, node.y1 = y2;
          node.x1 = x2 += node.value * dx;
        }
        y0 = y2;
      }

      // Position the row vertically along the left of the rect.
      else {
        for (y2 = y0, x2 = x0 + dx * sumValue / value, dy /= sumValue; i0 < i1; ++i0) {
          node = nodes[i0], node.y0 = y2, node.x0 = x0, node.x1 = x2;
          node.y1 = y2 += node.value * dy;
        }
        x0 = x2;
      }

      value -= sumValue;
    }
  }

  squarify.ratio = function(x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return squarify;
})((1 + Math.sqrt(5)) / 2);
