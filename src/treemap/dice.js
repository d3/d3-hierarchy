export default function(parent, rect) {
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
