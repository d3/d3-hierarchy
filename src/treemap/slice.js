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
