export default (function ratio(phi) {

  function squarify(parent, rect) {
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
      alpha = Math.max(dy / dx, dx / dy) / (value * phi);
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

  squarify.ratio = ratio;

  return squarify;
})((1 + Math.sqrt(5)) / 2);
